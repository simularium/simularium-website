import { createSelector } from "reselect";
import { reduce } from "lodash";
import { SelectionEntry, UIDisplayData } from "@aics/simularium-viewer";

import { getDefaultUIData } from "../../trajectory/selectors/basic";
import { AgentRenderingCheckboxMap } from "../types";

import { getAgentHighlightMap, getAgentVisibilityMap } from "./basic";

export const getHighlightedAgents = createSelector(
    [getAgentHighlightMap, getDefaultUIData],
    (
        highlightedAgents: AgentRenderingCheckboxMap,
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
    [getAgentVisibilityMap, getDefaultUIData],
    (
        agentVisibilityMap: AgentRenderingCheckboxMap,
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
                // agent has no states/children to show/hide
                if (!agent.displayStates.length) {
                    // if no tags and nothing is selected, include agent name
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
