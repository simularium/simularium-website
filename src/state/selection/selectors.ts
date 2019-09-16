import { State } from "../types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
