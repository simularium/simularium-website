import { castArray, without } from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    DESELECT_FILE,
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON_BY_KEY,
    HIGHLIGHT_AGENTS_BY_KEY,
    DRAG_OVER_VIEWER,
    RESET_DRAG_OVER_VIEWER,
} from "./constants";
import {
    DeselectFileAction,
    ChangeAgentsRenderingStateAction,
    SelectionStateBranch,
    SelectMetadataAction,
    ChangeTimeAction,
    ChangeNumberCollapsedPanelsAction,
    HighlightAgentAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
} from "./types";

export const initialState = {
    files: [],
    time: 0,
    numberPanelsCollapsed: 0,
    visibleAgentKeys: [],
    highlightedAgentKeys: [],
    draggedOverViewer: false,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_FILE]: {
        accepts: (action: AnyAction): action is DeselectFileAction =>
            action.type === DESELECT_FILE,
        perform: (state: SelectionStateBranch, action: DeselectFileAction) => ({
            ...state,
            files: without(state.files, ...castArray(action.payload)),
        }),
    },
    [TURN_AGENTS_ON_BY_KEY]: {
        accepts: (
            action: AnyAction
        ): action is ChangeAgentsRenderingStateAction =>
            action.type === TURN_AGENTS_ON_BY_KEY,
        perform: (
            state: SelectionStateBranch,
            action: ChangeAgentsRenderingStateAction
        ) => {
            return {
                ...state,
                visibleAgentKeys: action.payload,
            };
        },
    },

    [SELECT_METADATA]: {
        accepts: (action: AnyAction): action is SelectMetadataAction =>
            action.type === SELECT_METADATA,
        perform: (
            state: SelectionStateBranch,
            action: SelectMetadataAction
        ) => ({
            ...state,
            [action.key]: action.payload,
        }),
    },
    [CHANGE_TIME_HEAD]: {
        accepts: (action: AnyAction): action is ChangeTimeAction =>
            action.type === CHANGE_TIME_HEAD,
        perform: (state: SelectionStateBranch, action: ChangeTimeAction) => ({
            ...state,
            time: action.payload,
        }),
    },
    [SIDE_PANEL_COLLAPSED]: {
        accepts: (
            action: AnyAction
        ): action is ChangeNumberCollapsedPanelsAction =>
            action.type === SIDE_PANEL_COLLAPSED,
        perform: (
            state: SelectionStateBranch,
            action: ChangeNumberCollapsedPanelsAction
        ) => ({
            ...state,
            numberPanelsCollapsed: state.numberPanelsCollapsed + action.payload,
        }),
    },
    [HIGHLIGHT_AGENTS_BY_KEY]: {
        accepts: (
            action: AnyAction
        ): action is ChangeAgentsRenderingStateAction =>
            action.type === HIGHLIGHT_AGENTS_BY_KEY,
        perform: (
            state: SelectionStateBranch,
            action: HighlightAgentAction
        ) => ({
            ...state,
            highlightedAgentKeys: action.payload,
        }),
    },
    [DRAG_OVER_VIEWER]: {
        accepts: (action: AnyAction): action is DragOverViewerAction =>
            action.type === DRAG_OVER_VIEWER,
        perform: (state: SelectionStateBranch) => ({
            ...state,
            draggedOverViewer: true,
        }),
    },
    [RESET_DRAG_OVER_VIEWER]: {
        accepts: (action: AnyAction): action is ResetDragOverViewerAction =>
            action.type === RESET_DRAG_OVER_VIEWER,
        perform: (state: SelectionStateBranch) => ({
            ...state,
            draggedOverViewer: false,
        }),
    },
};

export default makeReducer<SelectionStateBranch>(
    actionToConfigMap,
    initialState
);
