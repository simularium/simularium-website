import { createSelector } from "reselect";
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
        let childrenIndeterminate = false;

        // iterate through, check items with children, and also get list of
        // agents with no children
        const agentsWithNoChildren = treeData.filter((agent) => {
            const visibleStates = agentVisibilityMap[agent.key];
            if (visibleStates && agent.children.length) {
                const someStatesVisible =
                    visibleStates.length < agent.children.length &&
                    visibleStates.length > 0;
                if (someStatesVisible) {
                    childrenIndeterminate = true;
                }
                return false;
            } else if (visibleStates) {
                return true;
            }
        });

        if (childrenIndeterminate) {
            // if there are children in indeterminate state, just return that, no other checks needed
            return childrenIndeterminate;
        }
        // otherwise, check agentsWithNoChildren, see if they're not all on or all off
        const agentsWithNoChildrenOn = agentsWithNoChildren.filter((agent) => {
            return agentVisibilityMap[agent.key].length === 1; // only top level agent, and it's checked
        });
        return (
            agentsWithNoChildrenOn.length > 0 &&
            agentsWithNoChildren.length !== agentsWithNoChildrenOn.length
        );
    }
);
