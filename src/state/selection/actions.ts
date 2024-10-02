import { UIDisplayData } from "@aics/simularium-viewer";
import { AgentMetadata, ColorChange } from "../../constants/interfaces";
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
    APPLY_USER_COLOR_SELECTION,
    GET_COLOR_SELECTIONS_FROM_BROWSER,
    CLEAR_COLOR_SELECTIONS_FROM_BROWSER_AND_STATE,
    SET_CURRENT_COLOR_SETTINGS,
    SET_USER_COLOR_SELECTIONS,
    CLEAR_COLOR_SELECTIONS_FROM_STATE,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectMetadataAction,
    ChangeTimeAction,
    SetVisibleAction,
    AgentRenderingCheckboxMap,
    ResetAction,
    SetRecentColorsAction,
    SetSelectedAgentMetadataAction,
    ApplyUserColorSelectionAction,
    SetCurrentColorSettingsAction,
    SetUserColorSelectionsAction,
    ColorSettings,
} from "./types";

export function changeTime(time: number): ChangeTimeAction {
    return {
        payload: time,
        type: CHANGE_TIME_HEAD,
    };
}

export function onSidePanelCollapse(numberCollapsed: number) {
    return {
        payload: numberCollapsed,
        type: SIDE_PANEL_COLLAPSED,
    };
}

export function setAgentsVisible(
    agentNames: AgentRenderingCheckboxMap
): SetVisibleAction {
    return {
        payload: agentNames,
        type: SET_AGENTS_VISIBLE,
    };
}

export function turnAgentsOnByDisplayKey(
    agentNames: AgentRenderingCheckboxMap
): ChangeAgentsRenderingStateAction {
    return {
        payload: agentNames,
        type: TURN_AGENTS_ON_BY_KEY,
    };
}

export function highlightAgentsByDisplayKey(
    agentNames: AgentRenderingCheckboxMap
): ChangeAgentsRenderingStateAction {
    return {
        payload: agentNames,
        type: HIGHLIGHT_AGENTS_BY_KEY,
    };
}

export function applyUserColorSelection(
    payload: ColorChange
): ApplyUserColorSelectionAction {
    return {
        payload,
        type: APPLY_USER_COLOR_SELECTION,
    };
}

export function selectMetadata(
    key: string,
    payload: string | number
): SelectMetadataAction {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}

export function resetAgentSelectionsAndHighlights(): ResetAction {
    return {
        type: RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS,
    };
}

export function setRecentColors(colors: string[]): SetRecentColorsAction {
    return {
        payload: colors,
        type: SET_RECENT_COLORS,
    };
}

export function setSelectedAgentMetadata(
    metaData: AgentMetadata
): SetSelectedAgentMetadataAction {
    return {
        payload: metaData,
        type: SET_SELECTED_AGENT,
    };
}

export function clearUserSelectedColors(): ResetAction {
    return { type: CLEAR_COLOR_SELECTIONS_FROM_BROWSER_AND_STATE };
}

export function getColorsFromLocalStorage() {
    return {
        type: GET_COLOR_SELECTIONS_FROM_BROWSER,
    };
}

export function setCurrentColorSettings(payload: {
    currentColorSettings: ColorSettings;
}): SetCurrentColorSettingsAction {
    return {
        payload,
        type: SET_CURRENT_COLOR_SETTINGS,
    };
}

export function setUserColorSelections(
    payload: UIDisplayData
): SetUserColorSelectionsAction {
    return {
        payload,
        type: SET_USER_COLOR_SELECTIONS,
    };
}

export function clearColorSelectionsFromState(): ResetAction {
    return {
        type: CLEAR_COLOR_SELECTIONS_FROM_STATE,
    };
}
