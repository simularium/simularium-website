import {
    VIEWER_LOADING,
    VIEWER_ERROR,
    VIEWER_EMPTY,
    VIEWER_SUCCESS,
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
    payload: ViewerStatusInfo;
    type: string;
}

export interface ViewerStatusInfo {
    htmlData?: string;
    errorMessage?: string;
    status: ViewerStatus;
    onClose?: () => void;
}

export interface ViewerError {
    htmlData?: string;
    message: string;
    onClose?: () => void;
}

export interface FrontEndError extends Error {
    htmlData?: string;
}

type VIEWER_LOADING = typeof VIEWER_LOADING;
type VIEWER_ERROR = typeof VIEWER_ERROR;
type VIEWER_EMPTY = typeof VIEWER_EMPTY;
type VIEWER_SUCCESS = typeof VIEWER_SUCCESS;
export type ViewerStatus =
    | VIEWER_LOADING
    | VIEWER_ERROR
    | VIEWER_EMPTY
    | VIEWER_SUCCESS;
