import {
    SET_STATUS,
    DRAG_FILE_OVER,
    RESET_DRAG_FILE_OVER,
    SET_BUFFERING,
    SET_IS_PLAYING,
    SET_ERROR,
} from "./constants";
import {
    ViewerStatus,
    SetViewerStatusAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    ToggleAction,
    ViewerError,
    SetErrorAction,
} from "./types";

export function setStatus(status: {
    status: ViewerStatus;
}): SetViewerStatusAction {
    return {
        payload: status,
        type: SET_STATUS,
    };
}

export function setError(error: ViewerError): SetErrorAction {
    return {
        payload: error,
        type: SET_ERROR,
    };
}

export function dragOverViewer(): DragOverViewerAction {
    return {
        type: DRAG_FILE_OVER,
    };
}

export function resetDragOverViewer(): ResetDragOverViewerAction {
    return {
        type: RESET_DRAG_FILE_OVER,
    };
}

export function setBuffering(payload: boolean): ToggleAction {
    return {
        payload,
        type: SET_BUFFERING,
    };
}

export function setIsPlaying(isPlaying: boolean): ToggleAction {
    return {
        payload: isPlaying,
        type: SET_IS_PLAYING,
    };
}
