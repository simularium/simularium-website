import { State } from "../types";
import { createSelector } from "reselect";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { getAgentDisplayNamesAndStates } from "../metadata/selectors";

// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentTime = (state: State) => state.selection.time;
export const getAgentsOnById = (state: State) => state.selection.agentIdsOn;
export const getAgentsOnByName = (state: State) => state.selection.agentNamesOn;

export const getNumberCollapsed = (state: State) =>
    state.selection.numberPanelsCollapsed;
export const getHightlightedId = (state: State) =>
    state.selection.hightlightedId;
export const modalOpen = (state: State) => state.selection.modalOpen;
// COMPOSED SELECTORS

export const getHightLightedNames = createSelector(
    [getHightlightedId],
    (hightedAgent) => {
        return [hightedAgent];
    }
);

export const getHightLightedTags = createSelector(
    [getHightlightedId],
    (hightedAgent) => {
        return [];
    }
);
export const getAgentNamesToHide = createSelector(
    [getAgentsOnByName, getAgentDisplayNamesAndStates],
    (currentlyOn, allAgents: UIDisplayData) => {
        return allAgents
            .filter((agent) => !currentlyOn.includes(agent.name))
            .map((agent) => agent.name);
    }
);

export const getAgentTagsToHide = createSelector(
    [getAgentsOnByName, getAgentDisplayNamesAndStates],
    (currentlyOn, allAgents: UIDisplayData) => {
        const allTagsShowing = currentlyOn
            .filter((agentKey: string) => agentKey.split("-").length > 1)
            .map((key: string) => key.split("-")[1]);
        const allTags = allAgents.reduce(
            (acc, currentAgent) => {
                acc = [
                    ...acc,
                    ...currentAgent.displayStates.map((state) => state.name),
                ];
                return acc;
            },
            [] as string[]
        );
        return allTags.filter((tag) => !allTagsShowing.includes(tag));
    }
);
