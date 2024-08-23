import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import {
    CLEAR_UI_DATA_FROM_BROWSER_AND_STATE,
    GET_UI_DATA_FROM_BROWSER,
    APPLY_USER_COLOR_SELECTION,
} from "./constants";
import { ReduxLogicDeps } from "../types";
import { getCurrentUIData, getSimulariumFile } from "../trajectory/selectors";
import {
    setCurrentColorSettings,
    setUserSelectedUIData,
} from "../trajectory/actions";
import { ColorSettings } from "../trajectory/types";

// primary functionality to store and apply user selected colors
// takes in colorChange payload and generates new UIDisplayData
// stores that data in local storage and redux
// and sets the current color settings to user selected
const applyUserSelectedColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getCurrentUIData(getState()); // gets current UIDD from redux
        const colorChange = action.payload;
        const newUiData = uiData.map((agent) => {
            const newAgent = { ...agent };
            if (agent.name === colorChange.agent.name) {
                if (colorChange.agent.tags.includes("")) {
                    newAgent.color = colorChange.color;
                }
                const newDisplayStates = agent.displayStates.map(
                    (state: any) => {
                        if (colorChange.agent.tags.includes(state.id)) {
                            return {
                                ...state,
                                color: colorChange.color,
                            };
                        }
                        return state;
                    }
                );
                newAgent.displayStates = newDisplayStates;
            }
            return newAgent;
        });
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.setItem(fileKey, JSON.stringify(newUiData));
        dispatch(setUserSelectedUIData(newUiData));
        dispatch(
            setCurrentColorSettings({
                currentColorSettings: ColorSettings.UserSelected,
            })
        );
        done();
    },
    type: APPLY_USER_COLOR_SELECTION,
});

const clearSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.removeItem(fileKey);
        dispatch(setUserSelectedUIData([]));
        done();
    },
    type: CLEAR_UI_DATA_FROM_BROWSER_AND_STATE,
});

const applySessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;

        const simulariumFile = getSimulariumFile(getState());
        const storedColorChanges = localStorage.getItem(simulariumFile.name);
        if (storedColorChanges !== "undefined" && storedColorChanges !== null) {
            const uiData = JSON.parse(storedColorChanges);
            dispatch(setUserSelectedUIData(uiData));
            dispatch(
                setCurrentColorSettings({
                    currentColorSettings: ColorSettings.UserSelected,
                })
            );
        }
        done();
    },
    type: GET_UI_DATA_FROM_BROWSER,
});

export default [
    applyUserSelectedColorsLogic,
    applySessionColorsLogic,
    clearSessionColorsLogic,
];
