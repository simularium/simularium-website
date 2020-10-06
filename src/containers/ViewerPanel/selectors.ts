import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { createSelector } from "reselect";
import {
    getAgentNamesToHide,
    getHightLightedNames,
    getHightLightedTags,
    getAgentTagsToHide,
} from "../../state/selection/selectors";
import { VisibilitySelectionMap } from "../../state/selection/types";

export const getSelectionStateInfoForViewer = createSelector(
    [
        getHightLightedNames,
        getHightLightedTags,
        getAgentNamesToHide,
        getAgentTagsToHide,
    ],
    (highlightedNames, highlightedTags, hiddenNames, hiddenTags) => ({
        highlightedNames,
        highlightedTags,
        hiddenNames,
        hiddenTags,
    })
);

export const convertUIDataToSelectionData = (
    uiData: UIDisplayData
): VisibilitySelectionMap => {
    const returnData: VisibilitySelectionMap = {};
    return uiData.reduce((acc, agent) => {
        acc[agent.name] = [];
        if (agent.displayStates) {
            acc[agent.name] = [
                agent.name,
                ...agent.displayStates.map((state) => state.name),
            ];
        }
        return acc;
    }, returnData);
};
