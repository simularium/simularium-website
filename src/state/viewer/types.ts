import { ErrorLevel } from "@aics/simularium-viewer";

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

export type ViewerStatus =
    | typeof VIEWER_LOADING
    | typeof VIEWER_ERROR
    | typeof VIEWER_EMPTY
    | typeof VIEWER_SUCCESS;
