import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import { AgentDisplayNode } from "../../components/AgentTree";
import { getAgentVisibilityMap } from "../../state/selection/selectors";
import { AgentRenderingCheckboxMap } from "../../state/selection/types";
import { getCurrentUIData } from "../../state/compoundSelectors";
import { UIDisplayData } from "@aics/simularium-viewer";

export const getUiDisplayDataTree = createSelector(
    [getCurrentUIData],
    (uiDisplayData: UIDisplayData) => {
        if (!uiDisplayData.length) {
            return [];
        }
        return uiDisplayData.map((agent) => ({
            title: agent.name,
            key: agent.name,
            color: agent.color,
            children: agent.displayStates.length
                ? [
                      ...agent.displayStates.map((state) => ({
                          label: state.name,
                          value: state.id,
                          color: state.color,
                      })),
                  ]
                : [],
        }));
    }
);

// Returns an agent visibility map that indicates all states should be visible
export const getSelectAllVisibilityMap = createSelector(
    [getUiDisplayDataTree],
    (treeData: AgentDisplayNode[]): AgentRenderingCheckboxMap => {
        const returnData: AgentRenderingCheckboxMap = {};
        return treeData.reduce((acc, agent: AgentDisplayNode) => {
            const { key } = agent;
            acc[key] = [];
            if (agent.children && agent.children.length) {
                acc[key] = agent.children.map(({ value }) => value as string);
            } else {
                acc[key] = [key];
            }
            return acc;
        }, returnData);
    }
);

// Returns an agent visibility map that indicates no states should be visible
export const getSelectNoneVisibilityMap = createSelector(
    [getUiDisplayDataTree],
    (treeData: AgentDisplayNode[]): AgentRenderingCheckboxMap => {
        const returnData: AgentRenderingCheckboxMap = {};
        return treeData.reduce((acc, agent) => {
            acc[agent.key] = [];
            return acc;
        }, returnData);
    }
);

// Determines if the shared checkbox should be partially checked (in "indeterminate" state)
export const getIsSharedCheckboxIndeterminate = createSelector(
    [getUiDisplayDataTree, getAgentVisibilityMap],
    (
        allAgents: AgentDisplayNode[],
        agentVisibilityMap: AgentRenderingCheckboxMap
    ): boolean => {
        if (isEmpty(agentVisibilityMap)) return false;

        let numInvisibleAgents = 0;

        // Loop through each agent and count how many are invisible. If an agent is partially
        // visible, just return true
        for (let i = 0; i < allAgents.length; i++) {
            const agent = allAgents[i];
            const visibleStates = agentVisibilityMap[agent.key];

            if (visibleStates === undefined) {
                // This should theoretically never happen
                console.warn(
                    `Skipping agent ${agent.key} in getIsSharedCheckboxIndeterminate because it doesn't exist in agentVisibilityMap`
                );
                continue;
            }

            if (!visibleStates.length) {
                numInvisibleAgents++;
            } else if (visibleStates.length < agent.children.length) {
                return true;
            }
        }

        // Return true if some but not all agents are visible
        return numInvisibleAgents > 0 && numInvisibleAgents < allAgents.length;
    }
);
