import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import { APPLY_SESSION_COLOR_CHANGES, SET_COLOR_CHANGES } from "./constants";
import { ReduxLogicDeps } from "../types";
import {
    getAgentDisplayNamesAndStates,
    getSimulariumFile,
} from "../trajectory/selectors";
import { receiveAgentNamesAndStates } from "../trajectory/actions";

const storeColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
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
        done();
    },
    type: [SET_COLOR_CHANGES, APPLY_SESSION_COLOR_CHANGES],
});

const storeSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const colorChange = action.payload;
        const fileKey = getSimulariumFile(getState()).name;
        const existingStorage = JSON.parse(
            sessionStorage.getItem(fileKey) || "[]"
        );
        existingStorage.push(colorChange);
        sessionStorage.setItem(fileKey, JSON.stringify(existingStorage));
        // todo: for development purposes its nice to be able to uncomment the line below
        // to quickly clear our sessionStorage
        // sessionStorage.removeItem(fileKey);
        done();
    },
    type: SET_COLOR_CHANGES,
});

export default [storeColorsLogic, storeSessionColorsLogic];
