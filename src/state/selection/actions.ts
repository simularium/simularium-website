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
    SET_IS_PLAYING,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectMetadataAction,
    ChangeTimeAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    SetVisibleAction,
    VisibilitySelectionMap,
    AgentColorMap,
    SetAllColorsAction,
    ResetAction,
    ToggleAction,
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

export function dragOverViewer(): DragOverViewerAction {
    return {
        type: DRAG_OVER_VIEWER,
    };
}

export function resetDragOverViewer(): ResetDragOverViewerAction {
    return {
        type: RESET_DRAG_OVER_VIEWER,
    };
}

export function resetAgentSelectionsAndHighlights(): ResetAction {
    return {
        type: RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS,
    };
}

export function setIsPlaying(isPlaying: boolean): ToggleAction {
    return {
        payload: isPlaying,
        type: SET_IS_PLAYING,
    };
}
