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
    SET_RECENT_COLORS,
    SET_SELECTED_AGENT,
    SET_SELECTED_DISPLAY_DATA,
    SET_CURRENT_COLOR_SETTINGS,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectionStateBranch,
    SelectMetadataAction,
    ChangeTimeAction,
    ChangeNumberCollapsedPanelsAction,
    SetVisibleAction,
    ResetAction,
    SetRecentColorsAction,
    SetSelectedAgentMetadataAction,
    SetSelectedUIDisplayDataAction,
    ColorSetting,
    SetCurrentColorSettingAction,
} from "./types";

export const initialState = {
    time: 0,
    numberPanelsCollapsed: 0,
    agentVisibilityMap: {},
    agentHighlightMap: {},
    recentColors: [],
    selectedAgentMetadata: {},
    selectedUIDisplayData: [],
    currentColorSetting: ColorSetting.Default,
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
                setSelectedUIDisplayData: initialState.selectedUIDisplayData,
                currentColorSetting: initialState.currentColorSetting,
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
    [SET_SELECTED_AGENT]: {
        accepts: (
            action: AnyAction
        ): action is SetSelectedAgentMetadataAction =>
            action.type === SET_SELECTED_AGENT,
        perform: (
            state: SelectionStateBranch,
            action: SetSelectedAgentMetadataAction
        ) => {
            return {
                ...state,
                selectedAgentMetadata: action.payload,
            };
        },
    },
    [SET_SELECTED_DISPLAY_DATA]: {
        accepts: (
            action: AnyAction
        ): action is SetSelectedUIDisplayDataAction =>
            action.type === SET_SELECTED_DISPLAY_DATA,
        perform: (
            state: SelectionStateBranch,
            action: SetSelectedUIDisplayDataAction
        ) => {
            return {
                ...state,
                selectedUIDisplayData: action.payload,
            };
        },
    },
    [SET_CURRENT_COLOR_SETTINGS]: {
        accepts: (action: AnyAction): action is SetCurrentColorSettingAction =>
            action.type === SET_CURRENT_COLOR_SETTINGS,
        perform: (
            state: SelectionStateBranch,
            action: SetCurrentColorSettingAction
        ) => {
            return {
                ...state,
                currentColorSetting: action.payload.currentColorSetting,
            };
        },
    },
};

export default makeReducer<SelectionStateBranch>(
    actionToConfigMap,
    initialState
);
