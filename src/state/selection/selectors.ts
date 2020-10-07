import { State } from "../types";
import { createSelector } from "reselect";
import { reduce } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { getAgentDisplayNamesAndStates } from "../metadata/selectors";
import { SelectionEntry, VisibilitySelectionMap } from "./types";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentsOnById = (state: State) => state.selection.agentIdsOn;
export const getVisibleAgentsNamesAndTags = (state: State) =>
    state.selection.visibleAgentKeys;
export const getHighlightedAgentsNamesAndTags = (state: State) =>
    state.selection.highlightedAgentKeys;

export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
export const getFileDraggedOverViewer = (state: State) =>
    state.selection.draggedOverViewer;
// COMPOSED SELECTORS

export const getHightLightedAgents = createSelector(
    [getHighlightedAgentsNamesAndTags, getAgentDisplayNamesAndStates],
    (
        highlightedAgents: VisibilitySelectionMap,
        allAgents: UIDisplayData
    ): SelectionEntry[] => {
        const init: SelectionEntry[] = [];
        return reduce(
            allAgents,
            (acc, agent) => {
                if (!highlightedAgents[agent.name]) {
                    return acc;
                }
                if (!agent.displayStates.length) {
                    // if no displayStates, but agent is highlighted, highlight agent
                    if (highlightedAgents[agent.name].length) {
                        acc.push({
                            name: agent.name,
                            tags: [],
                        });
                    }
                } else {
                    const highLightedTags = agent.displayStates
                        .filter((tag) =>
                            highlightedAgents[agent.name].includes(tag.id)
                        )
                        .map((displayState) => displayState.id);
                    if (highLightedTags.length) {
                        acc.push({
                            name: agent.name,
                            tags: highLightedTags,
                        });
                    }
                }

                return acc;
            },
            init
        );
    }
);

export const getAgentsToHide = createSelector(
    [getVisibleAgentsNamesAndTags, getAgentDisplayNamesAndStates],
    (
        currentlyOn: VisibilitySelectionMap,
        allAgents: UIDisplayData
    ): SelectionEntry[] => {
        const init: SelectionEntry[] = [];
        return reduce(
            allAgents,
            (acc, agent) => {
                if (!currentlyOn[agent.name]) {
                    return acc;
                }
                if (!agent.displayStates.length) {
                    // if no tags and nothing is on, include agent name
                    if (!currentlyOn[agent.name].length) {
                        acc.push({
                            name: agent.name,
                            tags: [],
                        });
                    }
                } else {
                    const hiddenTags = agent.displayStates
                        .filter(
                            (tag) => !currentlyOn[agent.name].includes(tag.id)
                        )
                        .map((displayState) => displayState.id);
                    if (hiddenTags.length) {
                        acc.push({
                            name: agent.name,
                            tags: hiddenTags,
                        });
                    }
                }

                return acc;
            },
            init
        );
    }
);
