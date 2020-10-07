import { MetadataStateBranch } from "../metadata/types";

export interface DeselectFileAction {
    payload: string | string[];
    type: string;
}

export interface SelectionStateBranch {
    [key: string]: any;
}

export interface DragOverViewerAction {
    type: string;
}

export interface ResetDragOverViewerAction {
    type: string;
}

export interface ChangeAgentsRenderingStateAction {
    payload: { [key: string]: string[] };
    type: string;
}

export interface SelectMetadataAction {
    key: keyof MetadataStateBranch;
    payload: string | number;
    type: string;
}

export interface ChangeTimeAction {
    payload: number;
    type: string;
}

export interface ChangeNumberCollapsedPanelsAction {
    payload: number;
    type: string;
}

export interface HighlightAgentAction {
    payload: string;
    type: string;
}

export interface ToggleAction {
    payload: boolean;
    type: string;
}

export interface VisibilitySelectionMap {
    [key: string]: string[];
}

export interface SetVisibleAction {
    payload: VisibilitySelectionMap;
    type: string;
}

export interface ToggleAllVisibleAction {
    payload: boolean;
    type: string;
}
