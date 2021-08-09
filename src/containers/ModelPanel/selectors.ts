import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import { AgentDisplayNode } from "../../components/CheckBoxTree";
import { getUiDisplayDataTree } from "../../state/trajectory/selectors";
import { getAgentVisibilityMap } from "../../state/selection/selectors";
import { VisibilitySelectionMap } from "../../state/selection/types";

// Returns an agent visibility map that indicates all states should be visible
export const getSelectAllVisibilityMap = createSelector(
    [getUiDisplayDataTree],
    (treeData: AgentDisplayNode[]): VisibilitySelectionMap => {
        const returnData: VisibilitySelectionMap = {};
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
    (treeData: AgentDisplayNode[]): VisibilitySelectionMap => {
        const returnData: VisibilitySelectionMap = {};
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
        treeData: AgentDisplayNode[],
        agentVisibilityMap: VisibilitySelectionMap
    ): boolean => {
        if (isEmpty(agentVisibilityMap)) return false;

        let isAgentPartiallyVisible = false;
        let numInvisibleAgents = 0;

        // Loop through each agent and count how many are invisible. If an agent is partially
        // visible, break out of loop and just return true
        for (let i = 0; i < treeData.length; i++) {
            const agent = treeData[i];
            const visibleStates = agentVisibilityMap[agent.key];

            if (!visibleStates.length) {
                // Agent has no visible states
                numInvisibleAgents++;
            } else if (visibleStates.length < agent.children.length) {
                // Agent is partially visible (only some children are visible)
                isAgentPartiallyVisible = true;
                break;
            }
        }

        if (isAgentPartiallyVisible) {
            return true;
        }

        // Return true if some but not all agents are visible
        return numInvisibleAgents > 0 && numInvisibleAgents < treeData.length;
    }
);
