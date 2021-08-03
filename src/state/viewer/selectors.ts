import { State } from "../types";

// BASIC SELECTORS
export const getViewerStatus = (state: State) => state.viewer.status;
export const getViewerError = (state: State) => state.viewer.viewerError;
export const getFileDraggedOverViewer = (state: State) =>
    state.viewer.draggedOverViewer;
export const getIsBuffering = (state: State) => state.viewer.isBuffering;
export const getIsPlaying = (state: State) => state.viewer.isPlaying;

// COMPOSED SELECTORS
