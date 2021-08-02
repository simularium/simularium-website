import { makeConstant } from "../util";
const BRANCH_NAME = "viewer";
const makeViewerConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const SET_VIEWER_STATUS = makeViewerConstant("set-viewer-status");
export const DRAG_OVER_VIEWER = makeViewerConstant("drag-over-viewer");
export const RESET_DRAG_OVER_VIEWER = makeViewerConstant("drag-off-viewer");
export const SET_BUFFERING = makeViewerConstant("set-buffering");
export const SET_IS_PLAYING = makeViewerConstant("set-is-playing");

export const VIEWER_EMPTY = "empty";
export const VIEWER_LOADING = "loading";
export const VIEWER_ERROR = "error";
export const VIEWER_SUCCESS = "success";
