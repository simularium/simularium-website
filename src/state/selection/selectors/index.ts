import { createSelector } from "reselect";
import { reduce } from "lodash";
import {
    ColorChanges,
    SelectionEntry,
    UIDisplayData,
} from "@aics/simularium-viewer/type-declarations";

import { getAgentDisplayNamesAndStates } from "../../trajectory/selectors";
import { ColorChangesMap, VisibilitySelectionMap } from "../types";

import {
    getAgentHighlightMap,
    getAgentVisibilityMap,
    getColorChangesMap,
} from "./basic";

export const getHighlightedAgents = createSelector(
    [getAgentHighlightMap, getAgentDisplayNamesAndStates],
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
                    // include unmodified tag if present
                    if (highlightedAgents[agent.name].includes("")) {
                        highLightedTags.push("");
                    }
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
    [getAgentVisibilityMap, getAgentDisplayNamesAndStates],
    (
        agentVisibilityMap: VisibilitySelectionMap,
        agentDisplayData: UIDisplayData
    ): SelectionEntry[] => {
        const init: SelectionEntry[] = [];
        return reduce(
            agentDisplayData,
            (acc, agent) => {
                // Theoretically, this block should never be hit because `agentVisibilityMap`
                // should always contain all the agents in `agentDisplayData`
                if (!agentVisibilityMap[agent.name]) {
                    return acc;
                }

                if (!agent.displayStates.length) {
                    // if no tags and nothing is on, include agent name
                    if (!agentVisibilityMap[agent.name].length) {
                        acc.push({
                            name: agent.name,
                            tags: [],
                        });
                    }
                } else {
                    const hiddenTags = agent.displayStates
                        .filter(
                            (tag) =>
                                !agentVisibilityMap[agent.name].includes(tag.id)
                        )
                        .map((displayState) => displayState.id);
                    // if unmodified state isn't checked, add to hidden tags
                    if (!agentVisibilityMap[agent.name].includes("")) {
                        hiddenTags.push("");
                    }
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

export const getColorChanges = createSelector(
    [getColorChangesMap, getAgentDisplayNamesAndStates],
    (
        colorChangesMap: ColorChangesMap,
        agentDisplayData: UIDisplayData
    ): ColorChanges[] => {
        const colorArray: ColorChanges[] = [];

        const agentColorChanges: SelectionEntry[] = reduce(
            agentDisplayData,
            (acc: SelectionEntry[], agent) => {
                if (!colorChangesMap.agents[agent.name]) {
                    return acc;
                }

                const agentTags = colorChangesMap.agents[agent.name];

                // If specific tags have color changes, or if the agent itself is present in the colorChangesMap
                if (agentTags && agentTags.length) {
                    acc.push({
                        name: agent.name,
                        tags: agentTags,
                    });
                } else {
                    acc.push({
                        name: agent.name,
                        tags: [],
                    });
                }
                return acc;
            },
            []
        );

        if (agentColorChanges.length) {
            colorArray.push({
                agents: agentColorChanges,
                color: colorChangesMap.color,
            });
        }

        return colorArray;
    }
);

export * from "./basic";
