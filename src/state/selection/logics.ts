import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import { ReduxLogicDeps } from "../types";
import { getAgentDisplayNamesAndStates } from "../trajectory/selectors";
import { receiveAgentNamesAndStates } from "../trajectory/actions";
import { STORE_COLORS_IN_STATE } from "./constants";

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
    type: STORE_COLORS_IN_STATE,
});

export default [storeColorsLogic];
