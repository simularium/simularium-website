import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import { ReduxLogicDeps } from "../types";
import { getSimulariumFile } from "../trajectory/selectors";
import { APPLY_USER_COLOR } from "./constants";
import { getSelectedUIDisplayData } from "./selectors";
import { setSelectedUIDisplayData } from "./actions";

const storeColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getSelectedUIDisplayData(getState());
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
        dispatch(setSelectedUIDisplayData(newUiData));
        // store color changes in local browser storage
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.setItem(fileKey, JSON.stringify(newUiData));
        done();
    },
    type: APPLY_USER_COLOR,
});

export default [storeColorsLogic];
