import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";
import {
    getDefaultUIDisplayData,
    getSimulariumFile,
} from "../trajectory/selectors";
import { getCurrentUIData } from "../compoundSelectors";
import {
    GET_DISPLAY_DATA_FROM_BROWSER,
    HANDLE_COLOR_CHANGE,
    CLEAR_UI_DATA_FROM_STATE,
} from "./constants";
import { setCurrentColorSetting, setSelectedUIDisplayData } from "./actions";
import { applyColorChangeToUiDisplayData, isSameAgentTree } from "../../util";
import { ColorSetting } from "./types";

const handleColorChangeLogic = createLogic({
    validate(deps: ReduxLogicDeps, allow, reject) {
        const { getState, action } = deps;
        const colorChange = action.payload;
        const currentDisplayData = getCurrentUIData(getState());
        const newDisplayData = applyColorChangeToUiDisplayData(
            colorChange,
            currentDisplayData
        );
        if (newDisplayData !== currentDisplayData) {
            const fileKey = getSimulariumFile(getState()).name;
            localStorage.setItem(fileKey, JSON.stringify(newDisplayData));
            allow(setSelectedUIDisplayData(newDisplayData));
        } else {
            reject(action);
        }
    },
    process() {
        return setCurrentColorSetting({
            currentColorSetting: ColorSetting.UserSelected,
        });
    },
    type: HANDLE_COLOR_CHANGE,
});

const getDisplayDataFromBrowserLogic = createLogic({
    validate(deps: ReduxLogicDeps, allow, reject) {
        const { getState, action } = deps;
        const fileKey = getSimulariumFile(getState()).name;
        const storedColorChanges = localStorage.getItem(fileKey) || "[]";
        if (storedColorChanges === "[]" || storedColorChanges === "undefined") {
            reject(action);
        }
        const storedUIData = JSON.parse(storedColorChanges);
        const defaultUIData = getDefaultUIDisplayData(getState());

        const validSettings = isSameAgentTree(storedUIData, defaultUIData);
        if (!validSettings) {
            console.warn(
                "Agent structures do not match, not applying color settings from browser storage"
            );
            reject(action);
        }
        allow(setSelectedUIDisplayData(storedUIData));
    },
    process() {
        return setCurrentColorSetting({
            currentColorSetting: ColorSetting.UserSelected,
        });
    },
    type: GET_DISPLAY_DATA_FROM_BROWSER,
});

export const resetSelectedUIDisplayDataLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.removeItem(fileKey);
        dispatch(
            setCurrentColorSetting({
                currentColorSetting: ColorSetting.Default,
            })
        );
        dispatch(setSelectedUIDisplayData([]));
        done();
    },
    type: CLEAR_UI_DATA_FROM_STATE,
});

export default [
    handleColorChangeLogic,
    getDisplayDataFromBrowserLogic,
    resetSelectedUIDisplayDataLogic,
];
