import { createSelector } from "reselect";
import {
    getAgentNamesToHide,
    getHightLightedNames,
    getHightLightedTags,
    getAgentTagsToHide,
} from "../../state/selection/selectors";

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
