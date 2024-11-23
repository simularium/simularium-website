import { createSelector } from "reselect";
import { UIDisplayData } from "@aics/simularium-viewer";
import { isEqual } from "lodash";

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

export const getDefaultUISettingsApplied = createSelector(
    [getSelectedUIDisplayData, getDefaultUIDisplayData],
    (selectedUIDisplayData, defaultUIData) => {
        /**
         * we can't just check if currentColorSettings === ColorSettings.Default
         * because that state can be used to preview settings
         */
        return (
            selectedUIDisplayData.length === 0 ||
            isEqual(selectedUIDisplayData, defaultUIData)
        );
    }
);
