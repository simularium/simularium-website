import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    SET_STATUS,
    VIEWER_ERROR,
    VIEWER_EMPTY,
    DRAG_OVER_VIEWER,
    RESET_DRAG_OVER_VIEWER,
    SET_BUFFERING,
    SET_IS_PLAYING,
} from "./constants";
import {
    ViewerStateBranch,
    SetViewerStatusAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    ToggleAction,
} from "./types";

export const initialState = {
    status: VIEWER_EMPTY,
    error: null,
    fileDraggedOver: false,
    isBuffering: false,
    isPlaying: false,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [SET_STATUS]: {
        accepts: (action: AnyAction): action is SetViewerStatusAction =>
            action.type === SET_STATUS,
        perform: (state: ViewerStateBranch, action: SetViewerStatusAction) => ({
            ...state,
            status: action.payload.status,
            error:
                action.payload.status === VIEWER_ERROR
                    ? {
                          message: action.payload.errorMessage,
                          htmlData: action.payload.htmlData,
                          onClose: action.payload.onClose,
                      }
                    : "",
        }),
    },
    [DRAG_OVER_VIEWER]: {
        accepts: (action: AnyAction): action is DragOverViewerAction =>
            action.type === DRAG_OVER_VIEWER,
        perform: (state: ViewerStateBranch) => ({
            ...state,
            fileDraggedOver: true,
        }),
    },
    [RESET_DRAG_OVER_VIEWER]: {
        accepts: (action: AnyAction): action is ResetDragOverViewerAction =>
            action.type === RESET_DRAG_OVER_VIEWER,
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
};

export default makeReducer<ViewerStateBranch>(actionToConfigMap, initialState);
