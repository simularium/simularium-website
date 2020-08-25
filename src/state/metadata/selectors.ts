import { createSelector } from "reselect";

import { State } from "../types";

import { MetadataStateBranch } from "./types";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getGraphData = (state: State) => state.metadata.graphData;
export const getTotalTimeOfCachedSimulation = (state: State) =>
    state.metadata.totalTime;
export const getTimeStepSize = (state: State) => state.metadata.timeStepSize;
export const getAgentIds = (state: State) => state.metadata.agentIds;
// COMPOSED SELECTORS
export const getKeysOfMetadata = createSelector(
    [getMetadata],
    (metadata: MetadataStateBranch): string[] => Object.keys(metadata)
);

export const getAgentDisplayNamesAndStates = (state: State) =>
    state.metadata.agentUiNames;

export const getUiDisplayDataTree = createSelector(
    [getAgentDisplayNamesAndStates],
    (uiDisplayData: UIDisplayData) => {
        return uiDisplayData.map((agent) => ({
            title: agent.name,
            key: agent.name,
            children: agent.displayStates.map((state) => ({
                title: state.name,
                key: `${agent.name}-${state.id}`,
            })),
        }));
    }
);
