import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON_BY_KEY,
    HIGHLIGHT_AGENTS_BY_KEY,
    SET_AGENTS_VISIBLE,
    RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS,
    SET_COLOR_CHANGES,
    SET_RECENT_COLORS,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectionStateBranch,
    SelectMetadataAction,
    ChangeTimeAction,
    ChangeNumberCollapsedPanelsAction,
    SetVisibleAction,
    ResetAction,
    SetColorChangesAction,
    SetRecentColorsAction,
} from "./types";

export const initialState = {
    time: 0,
    numberPanelsCollapsed: 0,
    agentVisibilityMap: {},
    agentHighlightMap: {},
    colorChanges: [],
    recentColors: [],
};

const actionToConfigMap: TypeToDescriptionMap = {
    [RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS]: {
        accepts: (action: AnyAction): action is ResetAction =>
            action.type === RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS,
        perform: (state: SelectionStateBranch) => {
            return {
                ...state,
                agentVisibilityMap: initialState.agentVisibilityMap,
                agentHighlightMap: initialState.agentHighlightMap,
                colorChanges: initialState.colorChanges,
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
                agentVisibilityMap: action.payload,
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
                agentVisibilityMap: {
                    ...state.agentVisibilityMap,
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
            agentHighlightMap: {
                ...state.agentHighlightMap,
                ...action.payload,
            },
        }),
    },
    [SET_COLOR_CHANGES]: {
        accepts: (action: AnyAction): action is SetColorChangesAction =>
            action.type === SET_COLOR_CHANGES,
        perform: (
            state: SelectionStateBranch,
            action: SetColorChangesAction
        ) => {
            return {
                ...state,
                colorChanges: [...state.colorChanges, ...action.payload],
            };
        },
    },
    [SET_RECENT_COLORS]: {
        accepts: (action: AnyAction): action is SetRecentColorsAction =>
            action.type === SET_RECENT_COLORS,
        perform: (
            state: SelectionStateBranch,
            action: SetRecentColorsAction
        ) => {
            return {
                ...state,
                recentColors: action.payload,
            };
        },
    },
};

export default makeReducer<SelectionStateBranch>(
    actionToConfigMap,
    initialState
);
