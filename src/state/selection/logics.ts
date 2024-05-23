import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import {
    SET_AGENTS_VISIBLE,
    SET_COLOR_CHANGES,
    STORE_UI_DATA_IN_BROWSER,
} from "./constants";
import { ReduxLogicDeps } from "../types";
import {
    getAgentDisplayNamesAndStates,
    getSimulariumFile,
} from "../trajectory/selectors";
import {
    receiveAgentNamesAndStates,
    setSessionUIData,
} from "../trajectory/actions";
import { storeColorsInLocalStorage } from "./actions";

const storeColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        // todo: is this still true? i think we are not doing this anymore with stored color changers
        // applies color changes either by the user
        // or from local storage
        const { action, getState } = deps;
        const uiData: UIDisplayData = getAgentDisplayNamesAndStates(getState());
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
        dispatch(receiveAgentNamesAndStates(newUiData));
        dispatch(storeColorsInLocalStorage(newUiData));
        done();
    },
    type: [SET_COLOR_CHANGES],
});

const storeSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps) {
        // syncs color changes to local browser storage
        // fired every time the user makes a color change
        const { getState, action } = deps;
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.setItem(fileKey, JSON.stringify(action.payload));
    },
    type: STORE_UI_DATA_IN_BROWSER,
});

const restoreSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;

        const simulariumFile = getSimulariumFile(getState());
        const storedColorChanges = localStorage.getItem(simulariumFile.name);
        if (storedColorChanges) {
            const uiData = JSON.parse(storedColorChanges);
            dispatch(setSessionUIData(uiData));
            dispatch(receiveAgentNamesAndStates(uiData));
            done();
        }
    },
    type: SET_AGENTS_VISIBLE,
});

export default [
    storeColorsLogic,
    storeSessionColorsLogic,
    restoreSessionColorsLogic,
];
