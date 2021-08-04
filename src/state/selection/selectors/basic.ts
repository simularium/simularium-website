import { State } from "../../types";

export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentsOnById = (state: State) => state.selection.agentIdsOn;
export const getAgentColors = (state: State) => state.selection.agentColors;
export const getVisibleAgentsNamesAndTags = (state: State) =>
    state.selection.visibleAgentKeys;
export const getHighlightedAgentsNamesAndTags = (state: State) =>
    state.selection.highlightedAgentKeys;
export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
