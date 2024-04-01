import { ColorChange } from "@aics/simularium-viewer";
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
    SET_FOLLOW_OBJECT,
} from "./constants";
import {
    ChangeAgentsRenderingStateAction,
    SelectMetadataAction,
    ChangeTimeAction,
    SetVisibleAction,
    VisibilitySelectionMap,
    ResetAction,
    SetColorChangeAction,
    SetRecentColorsAction,
    SetFollowAgentDataAction,
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

export function setColorChange(colorChange: ColorChange): SetColorChangeAction {
    return {
        payload: colorChange,
        type: SET_COLOR_CHANGES,
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

export function setFollowAgentData(
    agentData: number
): SetFollowAgentDataAction {
    return {
        payload: agentData,
        type: SET_FOLLOW_OBJECT,
    };
}
