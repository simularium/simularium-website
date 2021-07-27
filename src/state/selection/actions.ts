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
    SelectMetadataAction,
    ChangeTimeAction,
    SetVisibleAction,
    VisibilitySelectionMap,
    AgentColorMap,
    SetAllColorsAction,
    ResetAction,
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
    agentNames: VisibilitySelectionMap
): SetVisibleAction {
    return {
        payload: agentNames,
        type: SET_AGENTS_VISIBLE,
    };
}

export function turnAgentsOnByDisplayKey(
    agentNames: VisibilitySelectionMap
): ChangeAgentsRenderingStateAction {
    return {
        payload: agentNames,
        type: TURN_AGENTS_ON_BY_KEY,
    };
}

export function highlightAgentsByDisplayKey(
    agentNames: VisibilitySelectionMap
): ChangeAgentsRenderingStateAction {
    return {
        payload: agentNames,
        type: HIGHLIGHT_AGENTS_BY_KEY,
    };
}

export function setAllAgentColors(
    agentColorMap: AgentColorMap
): SetAllColorsAction {
    return {
        payload: agentColorMap,
        type: SET_ALL_AGENT_COLORS,
    };
}

export function changeAgentColor(
    agentColorMap: AgentColorMap
): SetAllColorsAction {
    return {
        payload: agentColorMap,
        type: CHANGE_AGENT_COLOR,
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
