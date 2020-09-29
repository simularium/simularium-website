import { State } from "../types";
import { createSelector } from "reselect";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import {
    getAgentDisplayNamesAndStates,
    getAllTags,
} from "../metadata/selectors";
import { flatMap } from "lodash";
import { VisibilitySelectionMap } from "./types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentsOnById = (state: State) => state.selection.agentIdsOn;
export const getVisibleAgentsNamesAndTags = (state: State) =>
    state.selection.visibleAgentKeys;
export const getHighlightedAgentsNamesAndTags = (state: State) =>
    state.selection.highlightedAgentKeys;

export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
export const getFileDraggedOverViewer = (state: State) =>
    state.selection.draggedOverViewer;
// COMPOSED SELECTORS

export const getHightLightedNames = createSelector(
    [getHighlightedAgentsNamesAndTags, getAgentDisplayNamesAndStates],
    (
        highlightedAgents: VisibilitySelectionMap,
        allAgents: UIDisplayData
    ): string[] => {
        const highlightedNames = flatMap(highlightedAgents).filter(
            (key: string) => Object.keys(highlightedAgents).includes(key)
        );
        return allAgents
            .filter((agent) => highlightedNames.includes(agent.name))
            .map((agent) => agent.name);
    }
);

export const getHightLightedTags = createSelector(
    [getHighlightedAgentsNamesAndTags, getAllTags],
    (highlightedAgents: VisibilitySelectionMap, allTags): string[] => {
        const allTagsHighlighted = flatMap(highlightedAgents);
        return allTags.filter((tag) => allTagsHighlighted.includes(tag));
    }
);
export const getAgentNamesToHide = createSelector(
    [getVisibleAgentsNamesAndTags, getAgentDisplayNamesAndStates],
    (
        currentlyOn: VisibilitySelectionMap,
        allAgents: UIDisplayData
    ): string[] => {
        const visibleNames = flatMap(currentlyOn).filter((key: string) =>
            Object.keys(currentlyOn).includes(key)
        );
        return allAgents
            .filter((agent) => !visibleNames.includes(agent.name))
            .map((agent) => agent.name);
    }
);

export const getAgentTagsToHide = createSelector(
    [getVisibleAgentsNamesAndTags, getAllTags],
    (currentlyOn, allTags): string[] => {
        const allTagsShowing = flatMap(currentlyOn);
        return allTags.filter((tag) => !allTagsShowing.includes(tag));
    }
);
