import { createSelector } from "reselect";
import { uniq, find } from "lodash";
import { State } from "../types";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    MetadataStateBranch,
    NetworkedSimFile,
} from "./types";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import TRAJECTORIES from "../../constants/networked-trajectories";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getPlotData = (state: State) => state.metadata.plotData;
export const getFirstFrameTimeOfCachedSimulation = (state: State) =>
    state.metadata.firstFrameTime;
export const getLastFrameTimeOfCachedSimulation = (state: State) =>
    state.metadata.lastFrameTime;
export const getNumFrames = (state: State) => state.metadata.numFrames;
export const getTimeStepSize = (state: State) => state.metadata.timeStepSize;
export const getTimeUnits = (state: State) => state.metadata.timeUnits;
export const getAgentIds = (state: State) => state.metadata.agentIds;
export const getSimulariumFile = (state: State) =>
    state.metadata.simulariumFile;
export const getSimulariumController = (state: State) =>
    state.metadata.simulariumController;
export const getViewerStatus = (state: State) => state.metadata.viewerStatus;
export const getViewerError = (state: State) => state.metadata.viewerError;

// COMPOSED SELECTORS
export const getIsNetworkedFile = createSelector(
    [getSimulariumFile],
    (simFile: LocalSimFile | NetworkedSimFile): boolean => {
        if (!simFile.name) {
            return false;
        }
        return (
            !!find(TRAJECTORIES, { id: simFile.name }) &&
            isNetworkSimFileInterface(simFile)
        );
    }
);

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
                          value: "",
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
