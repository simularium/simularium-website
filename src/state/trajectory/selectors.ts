import { createSelector } from "reselect";
import { uniq, find } from "lodash";
import { State } from "../types";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    TrajectoryStateBranch,
    NetworkedSimFile,
} from "./types";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import TRAJECTORIES from "../../constants/networked-trajectories";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.trajectory;
export const getPlotData = (state: State) => state.trajectory.plotData;
export const getFirstFrameTimeOfCachedSimulation = (state: State) =>
    state.trajectory.firstFrameTime;
export const getLastFrameTimeOfCachedSimulation = (state: State) =>
    state.trajectory.lastFrameTime;
export const getNumFrames = (state: State) => state.trajectory.numFrames;
export const getTimeStep = (state: State) => state.trajectory.timeStep;
export const getTimeUnits = (state: State) => state.trajectory.timeUnits;
export const getAgentIds = (state: State) => state.trajectory.agentIds;
export const getSimulariumFile = (state: State) =>
    state.trajectory.simulariumFile;

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
    (metadata: TrajectoryStateBranch): string[] => Object.keys(metadata)
);

export const getAgentDisplayNamesAndStates = (state: State) =>
    state.trajectory.agentUiNames;

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
