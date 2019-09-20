import {
    DESELECT_FILE,
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON,
    HIGHLIGHT_AGENT,
} from "./constants";
import {
    DeselectFileAction,
    TurnAgentsOnAction,
    SelectMetadataAction,
    ChangeTimeAction,
    HighlightAgentAction,
} from "./types";

export function deselectFile(fileId: string | string[]): DeselectFileAction {
    return {
        payload: fileId,
        type: DESELECT_FILE,
    };
}

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

export function turnAgentsOn(agentIds: string[]): TurnAgentsOnAction {
    return {
        payload: agentIds,
        type: TURN_AGENTS_ON,
    };
}

export function highlightAgent(agentIds: string): HighlightAgentAction {
    return {
        payload: agentIds,
        type: HIGHLIGHT_AGENT,
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
