import { createSelector } from "reselect";
import { UIDisplayData } from "@aics/simularium-viewer";

import { getDefaultUIDisplayData } from "../trajectory/selectors";
import {
    getCurrentColorSetting,
    getSelectedUIDisplayData,
} from "../selection/selectors";
import { ColorSetting } from "../selection/types";

export const getCurrentUIData = createSelector(
    [getCurrentColorSetting, getSelectedUIDisplayData, getDefaultUIDisplayData],
    (
        colorSetting: ColorSetting,
        sessionData: UIDisplayData,
        defaultData: UIDisplayData
    ) => {
        const fileHasBeenParsed = defaultData.length > 0;
        if (!fileHasBeenParsed) {
            return [];
        }
        if (colorSetting === ColorSetting.UserSelected) {
            return sessionData;
        }
        return defaultData;
    }
);
