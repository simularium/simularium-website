import { State } from "../../types";

export const getViewerStatus = (state: State) => state.viewer.viewerStatus;
export const getViewerError = (state: State) => state.viewer.viewerError;
export const getFileDraggedOverViewer = (state: State) =>
    state.viewer.draggedOverViewer;
export const getIsBuffering = (state: State) => state.viewer.isBuffering;
export const getIsPlaying = (state: State) => state.viewer.isPlaying;
