import { createSelector } from "reselect";
import { find } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
} from "../types";
import TRAJECTORIES from "../../../constants/networked-trajectories";

import { getSimulariumFile, getAgentDisplayNamesAndStates } from "./basic";

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
