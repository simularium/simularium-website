import { createSelector } from "reselect";
import { UIDisplayData } from "@aics/simularium-viewer";
import { isEqual } from "lodash";

import { getDefaultUIDisplayData } from "../trajectory/selectors";
import {
    getCurrentColorSetting,
    getSelectedUIDisplayData,
} from "../selection/selectors";
import { ColorSetting } from "../selection/types";

/**
 * compoundSelectors are selectors that consume state from multiple branches
 * of state, so don't belong in a particular branch's selectors file,
 * and are consumed by multiple containers, and so don't belong in a particular
 * container's selectors file.
 */

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

export const areDefaultUISettingsApplied = createSelector(
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
