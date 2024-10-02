import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    SET_STATUS,
    SET_ERROR,
    DRAG_FILE_OVER,
    RESET_DRAG_FILE_OVER,
    SET_BUFFERING,
    SET_IS_PLAYING,
    SET_IS_LOOPING,
} from "./constants";
import {
    ViewerStateBranch,
    SetViewerStatusAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    ToggleAction,
    SetErrorAction,
    ViewerStatus,
} from "./types";

export const initialState = {
    status: ViewerStatus.Empty,
    error: null,
    fileDraggedOver: false,
    isBuffering: false,
    isPlaying: false,
    isLooping: false,
    isFullScreen: false,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [SET_STATUS]: {
        accepts: (action: AnyAction): action is SetViewerStatusAction =>
            action.type === SET_STATUS,
        perform: (state: ViewerStateBranch, action: SetViewerStatusAction) => {
            if (action.payload.status !== ViewerStatus.Error) {
                return {
                    ...state,
                    status: action.payload.status,
                    error: initialState.error, // Clear out error
                };
            }
            return {
                ...state,
                status: action.payload.status,
            };
        },
    },
    [SET_ERROR]: {
        accepts: (action: AnyAction): action is SetErrorAction =>
            action.type === SET_ERROR,
        perform: (state: ViewerStateBranch, action: SetErrorAction) => ({
            ...state,
            error: { ...action.payload },
        }),
    },
    [DRAG_FILE_OVER]: {
        accepts: (action: AnyAction): action is DragOverViewerAction =>
            action.type === DRAG_FILE_OVER,
        perform: (state: ViewerStateBranch) => ({
            ...state,
            fileDraggedOver: true,
        }),
    },
    [RESET_DRAG_FILE_OVER]: {
        accepts: (action: AnyAction): action is ResetDragOverViewerAction =>
            action.type === RESET_DRAG_FILE_OVER,
        perform: (state: ViewerStateBranch) => ({
            ...state,
            fileDraggedOver: false,
        }),
    },
    [SET_BUFFERING]: {
        accepts: (action: AnyAction): action is ResetDragOverViewerAction =>
            action.type === SET_BUFFERING,
        perform: (state: ViewerStateBranch, action: ToggleAction) => ({
            ...state,
            isBuffering: action.payload,
        }),
    },
    [SET_IS_PLAYING]: {
        accepts: (action: AnyAction): action is ToggleAction =>
            action.type === SET_IS_PLAYING,
        perform: (state: ViewerStateBranch, action: ToggleAction) => ({
            ...state,
            isPlaying: action.payload,
        }),
    },
    [SET_IS_LOOPING]: {
        accepts: (action: AnyAction): action is ToggleAction =>
            action.type === SET_IS_LOOPING,
        perform: (state: ViewerStateBranch, action: ToggleAction) => ({
            ...state,
            isLooping: action.payload,
        }),
    },
    [SET_EMBED_FULLSCREEN]: {
        accepts: (action: AnyAction): action is ToggleAction =>
            action.type === SET_EMBED_FULLSCREEN,
        perform: (state: ViewerStateBranch, action: ToggleAction) => ({
            ...state,
            isFullScreen: action.payload,
        }),
    },
};

export default makeReducer<ViewerStateBranch>(actionToConfigMap, initialState);
