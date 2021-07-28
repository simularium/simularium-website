import { State } from "../types";

// BASIC SELECTORS
export const getViewerStatus = (state: State) => state.viewer.viewerStatus;
export const getViewerError = (state: State) => state.viewer.viewerError;

// COMPOSED SELECTORS
