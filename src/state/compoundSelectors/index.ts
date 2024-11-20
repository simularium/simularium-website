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
        return colorSetting === ColorSetting.UserSelected
            ? sessionData
            : defaultData;
    }
);
