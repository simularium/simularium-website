import { makeConstant } from "../util";
const BRANCH_NAME = "status";
const makeStatusConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const SET_VIEWER_STATUS = makeStatusConstant("set-viewer-status");
export const DRAG_OVER_VIEWER = makeStatusConstant("drag-over-viewer");
export const RESET_DRAG_OVER_VIEWER = makeStatusConstant("drag-off-viewer");
export const SET_BUFFERING = makeStatusConstant("set-buffering");
export const SET_IS_PLAYING = makeStatusConstant("set-is-playing");

export const VIEWER_EMPTY = "empty";
export const VIEWER_LOADING = "loading";
export const VIEWER_ERROR = "error";
export const VIEWER_SUCCESS = "success";
