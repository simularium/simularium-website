import {
    SET_STATUS,
    DRAG_OVER_VIEWER,
    RESET_DRAG_OVER_VIEWER,
    SET_BUFFERING,
    SET_IS_PLAYING,
} from "./constants";
import {
    ViewerStatusInfo,
    SetViewerStatusAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    ToggleAction,
} from "./types";

export function setStatus(payload: ViewerStatusInfo): SetViewerStatusAction {
    return {
        payload,
        type: SET_STATUS,
    };
}

export function dragOverViewer(): DragOverViewerAction {
    return {
        type: DRAG_OVER_VIEWER,
    };
}

export function resetDragOverViewer(): ResetDragOverViewerAction {
    return {
        type: RESET_DRAG_OVER_VIEWER,
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
