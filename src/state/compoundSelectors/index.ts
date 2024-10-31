import { createSelector } from "reselect";

import { getDefaultUIDisplayData } from "../trajectory/selectors";
import {
    getCurrentColorSettings,
    getSelectedUIDisplayData,
} from "../selection/selectors";
import { ColorSettings } from "../selection/types";
import { UIDisplayData } from "@aics/simularium-viewer";

export const getCurrentUIData = createSelector(
    [
        getCurrentColorSettings,
        getSelectedUIDisplayData,
        getDefaultUIDisplayData,
    ],
    (
        colorSetting: ColorSettings,
        sessionData: UIDisplayData,
        defaultData: UIDisplayData
    ) => {
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
