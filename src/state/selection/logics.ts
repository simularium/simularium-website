import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";
import {
    getDefaultUIDisplayData,
    getSimulariumFile,
} from "../trajectory/selectors";

import {
    GET_DISPLAY_DATA_FROM_BROWSER,
    STORE_DISPLAY_DATA_IN_BROWSER,
} from "./constants";
import { setCurrentColorSetting, setSelectedUIDisplayData } from "./actions";
import { compareAgentTrees } from "../../util";
import { ColorSetting } from "./types";

const storeDisplayDataInBrowserLogic = createLogic({
    process(deps: ReduxLogicDeps) {
        const { getState, action } = deps;
        const displayData = action.payload;
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.setItem(fileKey, JSON.stringify(displayData));
    },
    type: STORE_DISPLAY_DATA_IN_BROWSER,
});

const applySessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;

        const fileKey = getSimulariumFile(getState()).name;
        const storedColorChanges = localStorage.getItem(fileKey) || "[]";
        if (storedColorChanges === "[]" || storedColorChanges === "undefined") {
            done();
            return;
        }

        const storedUIData = JSON.parse(storedColorChanges);
        const defaultUIData = getDefaultUIDisplayData(getState());
        // const defaultUIData: UIDisplayData = [];

        // If default UI data hasn't been received from the viewer yet
        // store the retrieved settings but dont apply it yet.
        if (defaultUIData.length === 0) {
            dispatch(setSelectedUIDisplayData(storedUIData));
            done();
            return;
        }
        const validSettings = compareAgentTrees(storedUIData, defaultUIData);
        if (!validSettings) {
            console.warn(
                "Agent structures do not match, not applying color settings from browser storage"
            );
            done();
            return;
        }
        dispatch(setSelectedUIDisplayData(storedUIData));
        dispatch(
            setCurrentColorSetting({
                currentColorSetting: ColorSetting.UserSelected,
            })
        );
        done();
    },
    type: GET_DISPLAY_DATA_FROM_BROWSER,
});

export default [storeDisplayDataInBrowserLogic, applySessionColorsLogic];
