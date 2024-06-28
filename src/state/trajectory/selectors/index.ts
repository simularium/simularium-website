import { createSelector } from "reselect";
import { find, isEqual } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
} from "../types";

import TRAJECTORIES from "../../../constants/networked-trajectories";
import {
    getSimulariumFile,
    getAgentDisplayNamesAndStates,
    getDefaultUIData,
    getSessionUIData,
} from "./basic";

export const getIsNetworkedFile = createSelector(
    [getSimulariumFile],
    (simFile: LocalSimFile | NetworkedSimFile): boolean => {
        if (!simFile.name) {
            return false;
        }
        return isNetworkSimFileInterface(simFile);
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
            color: agent.color,
            children: agent.displayStates.length
                ? [
                      ...agent.displayStates.map((state) => ({
                          label: state.name,
                          value: state.id,
                          color: state.color,
                      })),
                  ]
                : [],
        }));
    }
);

export const getDefaultUISettingsApplied = createSelector(
    [getSessionUIData, getDefaultUIData],
    (sessionUIData, defaultUIData) => {
        if (sessionUIData.length === 0) {
            return true;
        }
        return isEqual(sessionUIData, defaultUIData);
    }
);

export * from "./basic";
