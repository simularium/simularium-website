import { ErrorLevel } from "@aics/simularium-viewer";

import {
    VIEWER_LOADING,
    VIEWER_ERROR,
    VIEWER_EMPTY,
    VIEWER_SUCCESS,
    VIEWER_IMPORTING,
} from "./constants";

export interface ViewerStateBranch {
    [key: string]: any;
}

export interface DragOverViewerAction {
    type: string;
}

export interface ResetDragOverViewerAction {
    type: string;
}

export interface ToggleAction {
    payload: boolean;
    type: string;
}

export interface SetViewerStatusAction {
    payload: { status: ViewerStatus };
    type: string;
}

export interface SetErrorAction {
    payload: ViewerError;
    type: string;
}

export interface ViewerError {
    level: ErrorLevel;
    message: string;
    htmlData?: string;
    onClose?: () => void;
}

type VIEWER_LOADING = typeof VIEWER_LOADING;
type VIEWER_ERROR = typeof VIEWER_ERROR;
type VIEWER_EMPTY = typeof VIEWER_EMPTY;
type VIEWER_SUCCESS = typeof VIEWER_SUCCESS;
type VIEWER_IMPORTING = typeof VIEWER_IMPORTING;
export type ViewerStatus =
    | VIEWER_LOADING
    | VIEWER_ERROR
    | VIEWER_EMPTY
    | VIEWER_SUCCESS
    | VIEWER_IMPORTING;
