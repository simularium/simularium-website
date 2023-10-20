import { TrajectoryStateBranch } from "../trajectory/types";

export interface SelectionStateBranch {
    [key: string]: any;
}

export interface ChangeAgentsRenderingStateAction {
    payload: { [key: string]: string[] };
    type: string;
}

export interface SelectMetadataAction {
    key: keyof TrajectoryStateBranch;
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

export interface ResetAction {
    type: string;
}

export interface SetColorChangesAction {
    payload: ColorChangesMap;
    type: string;
}
export interface ColorChangesMap {
    agents: VisibilitySelectionMap;
    color: string;
}
