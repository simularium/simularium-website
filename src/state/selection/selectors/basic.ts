import { State } from "../../types";

export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentsOnById = (state: State) => state.selection.agentIdsOn;
export const getAgentColors = (state: State) => state.selection.agentColors;
export const getAgentVisibilityMap = (state: State) =>
    state.selection.agentVisibilityMap;
export const getAgentHighlightMap = (state: State) =>
    state.selection.agentHighlightMap;
export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
