import { State } from "../types";

// BASIC SELECTORS
export const getStatus = (state: State) => state.viewer.status;
export const getError = (state: State) => state.viewer.error;
export const getFileDraggedOverViewer = (state: State) =>
    state.viewer.draggedOverViewer;
export const getIsBuffering = (state: State) => state.viewer.isBuffering;
export const getIsPlaying = (state: State) => state.viewer.isPlaying;

// COMPOSED SELECTORS
