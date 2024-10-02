import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import { SET_COLOR_CHANGES } from "./constants";
import { ReduxLogicDeps } from "../types";
import { getDefaultUIData } from "../trajectory/selectors";
import { setDefaultUIData } from "../trajectory/actions";

const storeColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getDefaultUIData(getState());
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
        dispatch(setDefaultUIData(newUiData));
        done();
    },
    type: SET_COLOR_CHANGES,
});

export default [storeColorsLogic];
