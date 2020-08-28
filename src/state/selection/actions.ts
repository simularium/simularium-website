import {
    DESELECT_FILE,
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON_BY_KEY,
    TOGGLE_LOAD_FILE_MODAL,
    HIGHLIGHT_AGENTS_BY_KEY,
} from "./constants";
import {
    DeselectFileAction,
    ChangeAgentsRenderingStateAction,
    SelectMetadataAction,
    ChangeTimeAction,
    ToggleAction,
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

export function turnAgentsOnByDisplayName(
    agentNames: string[]
): ChangeAgentsRenderingStateAction {
    return {
        payload: agentNames,
        type: TURN_AGENTS_ON_BY_KEY,
    };
}

export function highlightAgentsByDisplayName(
    agentNames: string[]
): ChangeAgentsRenderingStateAction {
    return {
        payload: agentNames,
        type: HIGHLIGHT_AGENTS_BY_KEY,
    };
}

export function openLoadFileModal(): ToggleAction {
    return {
        payload: true,
        type: TOGGLE_LOAD_FILE_MODAL,
    };
}

export function closeLoadFileModal(): ToggleAction {
    return {
        payload: false,
        type: TOGGLE_LOAD_FILE_MODAL,
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
