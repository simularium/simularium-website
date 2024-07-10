import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import {
    CLEAR_UI_DATA_FROM_BROWSER_AND_STATE,
    GET_UI_DATA_FROM_BROWSER,
    STORE_UI_DATA_IN_BROWSER,
} from "./constants";
import { ReduxLogicDeps } from "../types";
import { getCurrentUIData, getSimulariumFile } from "../trajectory/selectors";
import { setCurrentUIData, setSessionUIData } from "../trajectory/actions";

// session colors to do: rename or break up this logic
const storeSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getCurrentUIData(getState()); // gets current UIDD from redux
        const colorChange = action.payload;
        const newUiData = uiData.map((agent) => {
            // apply payload color change to make new UIDD
            // color sessions to do: make this a util?
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
        localStorage.setItem(fileKey, JSON.stringify(newUiData)); // store new UIDD in browser
        dispatch(setSessionUIData(newUiData)); // store new session UIDD in redux
        dispatch(setCurrentUIData(newUiData)); // set current UIDD equal to session UIDD
        done();
    },
    type: STORE_UI_DATA_IN_BROWSER,
});

const clearSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;
        const fileKey = getSimulariumFile(getState()).name;
        console.log("clear logic, filekey", fileKey);
        localStorage.removeItem(fileKey);
        dispatch(setSessionUIData([]));
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
            dispatch(setSessionUIData(uiData));
            dispatch(setCurrentUIData(uiData));
        }
        done();
    },
    type: GET_UI_DATA_FROM_BROWSER,
});

export default [
    storeSessionColorsLogic,
    applySessionColorsLogic,
    clearSessionColorsLogic,
];
