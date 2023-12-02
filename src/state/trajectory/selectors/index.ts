import { createSelector } from "reselect";
import { find } from "lodash";
import { ColorChange, UIDisplayData } from "@aics/simularium-viewer";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
} from "../types";

import TRAJECTORIES from "../../../constants/networked-trajectories";
import { getSimulariumFile, getAgentDisplayNamesAndStates } from "./basic";
import { getColorChange } from "../../selection/selectors";

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
    [getAgentDisplayNamesAndStates, getColorChange],
    (uiDisplayData: UIDisplayData, colorChange: ColorChange[]) => {
        if (!uiDisplayData.length) {
            return [];
        }
        console.log(colorChange);
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

export * from "./basic";
