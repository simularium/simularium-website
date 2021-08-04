import { createSelector } from "reselect";
import { uniq, find } from "lodash";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    TrajectoryStateBranch,
    NetworkedSimFile,
} from "../types";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import TRAJECTORIES from "../../../constants/networked-trajectories";

import {
    getSimulariumFile,
    getTrajectory,
    getAgentDisplayNamesAndStates,
} from "./basic";

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

export const getKeysOfTrajectory = createSelector(
    [getTrajectory],
    (trajectory: TrajectoryStateBranch): string[] => Object.keys(trajectory)
);

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

export * from "./basic";
