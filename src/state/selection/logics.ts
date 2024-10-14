import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import { ReduxLogicDeps } from "../types";
import { getDefaultUIDisplayData } from "../trajectory/selectors";
import { setDefaultUIData } from "../trajectory/actions";
import { APPLY_USER_COLOR } from "./constants";

const storeColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getDefaultUIDisplayData(getState());
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
    type: APPLY_USER_COLOR,
});

export default [storeColorsLogic];
