import { State } from "../../types";

export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentVisibilityMap = (state: State) =>
    state.selection.agentVisibilityMap;
export const getAgentHighlightMap = (state: State) =>
    state.selection.agentHighlightMap;
export const getColorChangesMap = (state: State) =>
    state.selection.colorChangesMap;
export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
