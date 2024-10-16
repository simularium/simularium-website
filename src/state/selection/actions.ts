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
    APPLY_USER_COLOR,
    SET_SELECTED_DISPLAY_DATA,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectMetadataAction,
    ChangeTimeAction,
    SetVisibleAction,
    AgentRenderingCheckboxMap,
    ResetAction,
    ApplyUserColorAction,
    SetRecentColorsAction,
    SetSelectedAgentMetadataAction,
    SetSelectedUIDisplayDataAction,
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

export function applyUserColor(payload: ColorChange): ApplyUserColorAction {
    return {
        payload,
        type: APPLY_USER_COLOR,
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
