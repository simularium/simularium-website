import { createSelector } from "reselect";
import { reduce } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { SelectionEntry } from "@aics/simularium-viewer/type-declarations/simularium/SelectionInterface";

import { getAgentDisplayNamesAndStates } from "../../trajectory/selectors";
import { VisibilitySelectionMap } from "../types";

import { getAgentHighlightMap, getAgentVisibilityMap } from "./basic";

export const getHighLightedAgents = createSelector(
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

export * from "./basic";
