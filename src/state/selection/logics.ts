import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import { compareAgentTrees } from "../../util";
import { ReduxLogicDeps } from "../types";
import {
    getCurrentUIData,
    getDefaultUIData,
    getSimulariumFile,
} from "../trajectory/selectors";
import {
    CLEAR_COLOR_SELECTIONS_FROM_BROWSER_AND_STATE,
    GET_COLOR_SELECTIONS_FROM_BROWSER,
    APPLY_USER_COLOR_SELECTION,
} from "./constants";
import { setUserColorSelections, setCurrentColorSettings } from "./actions";
import { ColorSettings } from "./types";

/**
 * In response to user selections, this logic
 * takes in a colorChange payload and generates new UIDisplayData
 * to store that data in local storage and redux
 * and sets the current color settings to user selected
 */
const applyUserSelectedColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getCurrentUIData(getState());
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
        // store color changes in local browser storage
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.setItem(fileKey, JSON.stringify(newUiData));
        // update redux state to store new color changes
        // and apply them via currentColorSettings
        dispatch(setUserColorSelections(newUiData));
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
        dispatch(setUserColorSelections([]));
        done();
    },
    type: CLEAR_COLOR_SELECTIONS_FROM_BROWSER_AND_STATE,
});

const applySessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;

        const simulariumFile = getSimulariumFile(getState());
        const defaultUIData = getDefaultUIData(getState());
        const storedColorChanges = localStorage.getItem(simulariumFile.name);
        if (storedColorChanges !== "undefined" && storedColorChanges !== null) {
            const uiData = JSON.parse(storedColorChanges);
            // if default UI data hasn't been received from the viewer
            // store these settings but dont apply them until a matching
            // agent structure is verified
            if (defaultUIData.length === 0) {
                dispatch(setUserColorSelections(uiData));
                done();
                return;
            }
            // if default UI data has been received, check that the
            // agent tree structures match before applying the stored
            // color settings
            const agentStructuresMatch = compareAgentTrees(
                uiData,
                defaultUIData
            );
            if (!agentStructuresMatch) {
                console.warn(
                    "Agent structures do not match, not applying color settings from browser storage"
                );
                done();
                return;
            }
            dispatch(setUserColorSelections(uiData));
            dispatch(
                setCurrentColorSettings({
                    currentColorSettings: ColorSettings.UserSelected,
                })
            );
        }
        done();
    },
    type: GET_COLOR_SELECTIONS_FROM_BROWSER,
});

export default [
    applyUserSelectedColorsLogic,
    applySessionColorsLogic,
    clearSessionColorsLogic,
];
