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
    SetVisibleAction,
    SetAllColorsAction,
    ResetAction,
} from "./types";

export const initialState = {
    time: 0,
    numberPanelsCollapsed: 0,
    agentVisibilityMap: {},
    agentHighlightMap: {},
    agentColors: {},
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
};

export default makeReducer<SelectionStateBranch>(
    actionToConfigMap,
    initialState
);
