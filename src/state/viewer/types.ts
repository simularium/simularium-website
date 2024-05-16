import { ErrorLevel } from "@aics/simularium-viewer";

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

export enum ViewerStatus {
    Loading = "VIEWER_LOADING",
    Error = "VIEWER_ERROR",
    Empty = "VIEWER_EMPTY",
    Success = "VIEWER_SUCCESS",
}
