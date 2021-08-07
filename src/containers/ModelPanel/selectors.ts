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

        // iterate through, check items with children, and also get list of
        // agents with no children
        const agentsWithNoChildren = treeData.filter((agent) => {
            const visibleStates = agentVisibilityMap[agent.key];
            if (visibleStates.length && agent.children.length) {
                const someStatesVisible =
                    visibleStates.length < agent.children.length &&
                    visibleStates.length > 0;
                if (someStatesVisible) {
                    isAgentPartiallyVisible = true;
                }
                return false;
            } else if (agent.children.length && !visibleStates.length) {
                numInvisibleAgents++;
                return false;
            } else if (!agent.children.length) {
                return true;
            }
        });

        if (isAgentPartiallyVisible) {
            // if there are children in indeterminate state, just return that, no other checks needed
            return true;
        }
        // otherwise, check agentsWithNoChildren, see if they're not all on or all off
        agentsWithNoChildren.forEach((agent) => {
            if (agentVisibilityMap[agent.key].length === 0) {
                numInvisibleAgents++;
            }
        });
        return numInvisibleAgents > 0 && numInvisibleAgents < treeData.length;
    }
);
