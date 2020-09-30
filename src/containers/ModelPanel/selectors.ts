import { createSelector } from "reselect";
import { AgentDisplayNode } from "../../components/CheckBoxTree";
import { getUiDisplayDataTree } from "../../state/metadata/selectors";
import { getVisibleAgentsNamesAndTags } from "../../state/selection/selectors";
import { VisibilitySelectionMap } from "../../state/selection/types";

export const convertUITreeDataToSelectAll = createSelector(
    [getUiDisplayDataTree],
    (treeData: AgentDisplayNode[]): VisibilitySelectionMap => {
        const returnData: VisibilitySelectionMap = {};
        return treeData.reduce((acc, agent: AgentDisplayNode) => {
            const { key } = agent;
            acc[key] = [];
            if (agent.children) {
                acc[key] = agent.children.map(({ value }) => value as string);
            }
            return acc;
        }, returnData);
    }
);

export const convertUITreeDataToSelectNone = createSelector(
    [getUiDisplayDataTree],
    (treeData: AgentDisplayNode[]): VisibilitySelectionMap => {
        const returnData: VisibilitySelectionMap = {};
        return treeData.reduce((acc, agent) => {
            acc[agent.key] = [];
            return acc;
        }, returnData);
    }
);

export const getCheckboxAllIsIntermediate = createSelector(
    [getUiDisplayDataTree, getVisibleAgentsNamesAndTags],
    (treeData, visibleAgents) => {
        return treeData.some((agent) => {
            if (visibleAgents[agent.key] && agent.children) {
                console.log(
                    visibleAgents[agent.key].length,
                    agent.children.length
                );
                return (
                    visibleAgents[agent.key].length !== agent.children.length
                );
            } else {
                return false;
            }
        });
    }
);
