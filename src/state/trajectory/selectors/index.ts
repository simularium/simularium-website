import { createSelector } from "reselect";
import { isEqual } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer";

import {
    getCurrentColorSettings,
    getUserColorSelections,
} from "../../selection/selectors";
import { ColorSettings } from "../../selection/types";
import {
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
} from "../types";
import { getSimulariumFile, getDefaultUIData } from "./basic";

export const getIsNetworkedFile = createSelector(
    [getSimulariumFile],
    (simFile: LocalSimFile | NetworkedSimFile): boolean => {
        if (!simFile.name) {
            return false;
        }
        return isNetworkSimFileInterface(simFile);
    }
);

export const getCurrentUIData = createSelector(
    [getCurrentColorSettings, getUserColorSelections, getDefaultUIData],
    (colorSetting, sessionData, defaultData) => {
        const fileHasBeenParsed = defaultData.length > 0;
        if (!fileHasBeenParsed) {
            return [];
        }
        if (colorSetting === ColorSettings.UserSelected) {
            return sessionData;
        }
        return defaultData;
    }
);

export const getUiDisplayDataTree = createSelector(
    [getDefaultUIData],
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
    [getUserColorSelections, getDefaultUIData],
    (userSelectedUIData, defaultUIData) => {
        /**
         * we can't simply check if currentColorSettings === ColorSettings.Default
         * because that state can be used to preview settings before they are applied
         */
        return (
            userSelectedUIData.length === 0 ||
            isEqual(userSelectedUIData, defaultUIData)
        );
    }
);

export * from "./basic";
