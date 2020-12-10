import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON_BY_KEY,
    HIGHLIGHT_AGENTS_BY_KEY,
    DRAG_OVER_VIEWER,
    RESET_DRAG_OVER_VIEWER,
    SET_AGENTS_VISIBLE,
    SET_ALL_AGENT_COLORS,
    CHANGE_AGENT_COLOR,
    RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectionStateBranch,
    SelectMetadataAction,
    ChangeTimeAction,
    ChangeNumberCollapsedPanelsAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    SetVisibleAction,
    SetAllColorsAction,
    ResetAction,
} from "./types";

export const initialState = {
    time: 0,
    numberPanelsCollapsed: 0,
    visibleAgentKeys: {},
    highlightedAgentKeys: {},
    draggedOverViewer: false,
    agentColors: {},
};

const actionToConfigMap: TypeToDescriptionMap = {
    [RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS]: {
        accepts: (action: AnyAction): action is ResetAction =>
            action.type === RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS,
        perform: (state: SelectionStateBranch) => {
            return {
                ...state,
                visibleAgentKeys: initialState.visibleAgentKeys,
                highlightedAgentKeys: initialState.highlightedAgentKeys,
            };
        },
    },
    [SET_AGENTS_VISIBLE]: {
        accepts: (action: AnyAction): action is SetVisibleAction =>
            action.type === SET_AGENTS_VISIBLE,
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
                visibleAgentKeys: {
                    ...state.visibleAgentKeys,
                    ...action.payload,
                },
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
            action: ChangeAgentsRenderingStateAction
        ) => ({
            ...state,
            highlightedAgentKeys: {
                ...state.highlightedAgentKeys,
                ...action.payload,
            },
        }),
    },
    [SET_ALL_AGENT_COLORS]: {
        accepts: (action: AnyAction): action is SetAllColorsAction =>
            action.type === SET_ALL_AGENT_COLORS,
        perform: (state: SelectionStateBranch, action: SetAllColorsAction) => ({
            ...state,
            agentColors: action.payload,
        }),
    },
    [CHANGE_AGENT_COLOR]: {
        accepts: (action: AnyAction): action is SetAllColorsAction =>
            action.type === CHANGE_AGENT_COLOR,
        perform: (state: SelectionStateBranch, action: SetAllColorsAction) => ({
            ...state,
            agentColors: {
                ...state.agentColors,
                ...action.payload,
            },
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
