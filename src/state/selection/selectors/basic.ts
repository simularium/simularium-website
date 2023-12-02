import { State } from "../../types";

export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentVisibilityMap = (state: State) =>
    state.selection.agentVisibilityMap;
export const getAgentHighlightMap = (state: State) =>
    state.selection.agentHighlightMap;
export const getColorChange = (state: State) => state.selection.colorChange;
export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
export const getRecentColors = (state: State) => state.selection.recentColors;
