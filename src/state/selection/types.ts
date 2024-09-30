import { AgentMetadata, ColorChange } from "../../constants/interfaces";
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
/**
 * AgentRenderingCheckboxMap represents the state of the visibility checkboxes
 * and the highlight checkboxes
 * In the case of agents with no displaystates/children:
 * {
 *    [agentName]: ["agentName"]
 * }
 * means that checkbox is currently checked. The agent name is basically treated
 * as a display state
 *
 *
 * in the case of agents with children:
 * {
 *     [agentName]: [...everyChild]
 * }
 * means the parent and all the children are current checked. The parent is the key
 * in the map, but not included as a name because it's only the title and not an actual
 * agent state
 */
export interface AgentRenderingCheckboxMap {
    [key: string]: string[];
}

export interface SetVisibleAction {
    payload: AgentRenderingCheckboxMap;
    type: string;
}

export interface ToggleAllVisibleAction {
    payload: boolean;
    type: string;
}

export interface ResetAction {
    type: string;
}

export interface SetColorChangeAction {
    payload: ColorChange;
    type: string;
}

export interface SetRecentColorsAction {
    payload: string[];
    type: string;
}

export interface SetSelectedAgentMetadataAction {
    payload: AgentMetadata;
    type: string;
}
