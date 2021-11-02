import { State } from "../../types";

export const getStatus = (state: State) => state.viewer.status;
export const getError = (state: State) => state.viewer.error;
export const getFileDraggedOver = (state: State) =>
    state.viewer.fileDraggedOver;
export const getIsBuffering = (state: State) => state.viewer.isBuffering;
export const getIsPlaying = (state: State) => state.viewer.isPlaying;
