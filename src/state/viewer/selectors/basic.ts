import { State } from "../../types";

export const getStatus = (state: State) => state.viewer.status;
export const getError = (state: State) => state.viewer.error;
export const getFileDraggedOver = (state: State) =>
    state.viewer.fileDraggedOver;
export const getIsBuffering = (state: State) => state.viewer.isBuffering;
export const getIsPlaying = (state: State) => state.viewer.isPlaying;
export const getServerHealth = (state: State) => state.viewer.serverHealth;
export const getIsLooping = (state: State) => state.viewer.isLooping;
