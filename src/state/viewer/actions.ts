import {
    SET_STATUS,
    DRAG_FILE_OVER,
    RESET_DRAG_FILE_OVER,
    SET_BUFFERING,
    SET_IS_PLAYING,
    SET_ERROR,
    SET_IS_LOOPING,
    SET_EMBED_FULLSCREEN,
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

export function setStatus(payload: {
    status: ViewerStatus;
}): SetViewerStatusAction {
    return {
        payload,
        type: SET_STATUS,
    };
}

export function setError(payload: ViewerError): SetErrorAction {
    return {
        payload,
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

export function setIsLooping(isLooping: boolean): ToggleAction {
    return {
        payload: isLooping,
        type: SET_IS_LOOPING,
    };
}

export function setIsFullScreen(fullscreen: boolean): ToggleAction {
    return {
        payload: fullscreen,
        type: SET_EMBED_FULLSCREEN,
    };
}
