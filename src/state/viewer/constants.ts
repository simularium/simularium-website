import { makeConstant } from "../util";
const BRANCH_NAME = "viewer";
const makeViewerConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const SET_STATUS = makeViewerConstant("set-status");
export const SET_ERROR = makeViewerConstant("set-error");
export const DRAG_FILE_OVER = makeViewerConstant("drag-file-over");
export const RESET_DRAG_FILE_OVER = makeViewerConstant("reset-drag-file-over");
export const SET_BUFFERING = makeViewerConstant("set-buffering");
export const SET_IS_PLAYING = makeViewerConstant("set-is-playing");
export const SET_SERVER_HEALTH = makeViewerConstant("set-server-health");
export const SET_IS_LOOPING = makeViewerConstant("set-is-looping");

export const VIEWER_EMPTY = "empty";
export const VIEWER_LOADING = "loading";
export const VIEWER_ERROR = "error";
export const VIEWER_SUCCESS = "success";
export const VIEWER_IMPORTING = "importing";
