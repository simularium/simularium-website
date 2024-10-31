import { UIDisplayData } from "@aics/simularium-viewer";
import { AgentMetadata } from "../../constants/interfaces";
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
    GET_DISPLAY_DATA_FROM_BROWSER,
    SET_CURRENT_COLOR_SETTINGS,
    STORE_DISPLAY_DATA_IN_BROWSER,
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
    SetSelectedUIDisplayDataAction,
    ColorSettings,
    SetCurrentColorSettingsAction,
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

export function setSelectedUIDisplayData(
    displayData: UIDisplayData
): SetSelectedUIDisplayDataAction {
    return {
        payload: displayData,
        type: SET_SELECTED_DISPLAY_DATA,
    };
}

export function storeDisplayDataInBrowser(
    displayData: UIDisplayData
): SetSelectedUIDisplayDataAction {
    return {
        payload: displayData,
        type: STORE_DISPLAY_DATA_IN_BROWSER,
    };
}

export function getDisplayDataFromBrowserStorage() {
    return {
        type: GET_DISPLAY_DATA_FROM_BROWSER,
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
