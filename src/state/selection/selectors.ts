import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentsOn = (state: State) => state.selection.agentsOn;
export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
export const getHightlightedId = (state: State) =>
    state.selection.hightlightedId;
export const modalOpen = (state: State) => state.selection.modalOpen;
// COMPOSED SELECTORS
