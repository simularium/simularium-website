import { createSelector } from "reselect";
import { reduce } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { SelectionEntry } from "@aics/simularium-viewer/type-declarations/simularium/SelectionInterface";

import { getAgentDisplayNamesAndStates } from "../../trajectory/selectors";
import { VisibilitySelectionMap } from "../types";

import {
    getHighlightedAgentsNamesAndTags,
    getVisibleAgentsNamesAndTags,
} from "./basic";

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
                    // if unmodified state isn't checked, add to hidden tags
                    if (!currentlyOn[agent.name].includes("")) {
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
