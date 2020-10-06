import { createSelector } from "reselect";
import { uniq } from "lodash";
import { State } from "../types";

import { MetadataStateBranch } from "./types";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getPlotData = (state: State) => state.metadata.plotData;
export const getTotalTimeOfCachedSimulation = (state: State) =>
    state.metadata.totalTime;
export const getTimeStepSize = (state: State) => state.metadata.timeStepSize;
export const getAgentIds = (state: State) => state.metadata.agentIds;
export const getSimulariumFile = (state: State) =>
    state.metadata.simulariumFile;
export const getSimulariumController = (state: State) =>
    state.metadata.simulariumController;
export const getViewerStatus = (state: State) => state.metadata.viewerStatus;

// COMPOSED SELECTORS
export const getKeysOfMetadata = createSelector(
    [getMetadata],
    (metadata: MetadataStateBranch): string[] => Object.keys(metadata)
);

export const getAgentDisplayNamesAndStates = (state: State) =>
    state.metadata.agentUiNames;

export const getAllTags = createSelector(
    [getAgentDisplayNamesAndStates],
    (uiDisplayData: UIDisplayData) => {
        return uniq(
            uiDisplayData.reduce(
                (acc, currentAgent) => {
                    acc = [
                        ...acc,
                        ...currentAgent.displayStates.map(
                            (state) => state.name
                        ),
                    ];
                    return acc;
                },
                [] as string[]
            )
        );
    }
);

export const getUiDisplayDataTree = createSelector(
    [getAgentDisplayNamesAndStates],
    (uiDisplayData: UIDisplayData) => {
        if (!uiDisplayData.length) {
            return [];
        }
        return uiDisplayData.map((agent) => ({
            title: agent.name,
            key: agent.name,
            children: agent.displayStates.length
                ? [
                      {
                          label: "<unmodified>",
                          value: agent.name,
                      },
                      ...agent.displayStates.map((state) => ({
                          label: state.name,
                          value: state.id,
                      })),
                  ]
                : [],
        }));
    }
);
