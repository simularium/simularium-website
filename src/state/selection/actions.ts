import {
    DESELECT_FILE,
    SELECT_METADATA,
    CHANGE_TIME_HEAD,
    SIDE_PANEL_COLLAPSED,
    TURN_AGENTS_ON_BY_KEY,
    HIGHLIGHT_AGENTS_BY_KEY,
    DRAG_OVER_VIEWER,
    RESET_DRAG_OVER_VIEWER,
    SET_AGENTS_VISIBLE,
} from "./constants";
import {
    DeselectFileAction,
    ChangeAgentsRenderingStateAction,
    SelectMetadataAction,
    ChangeTimeAction,
    DragOverViewerAction,
    ResetDragOverViewerAction,
    SetVisibleAction,
    VisibilitySelectionMap,
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
