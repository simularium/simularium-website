import { SimulariumController } from "@aics/simularium-viewer/type-declarations";
import { createLogic } from "redux-logic";

import { getSimulariumController } from "../simularium/selectors";
import { ReduxLogicDeps } from "../types";

import { SET_IS_PLAYING } from "./constants";

const setPlayingLogic = createLogic({
    process(deps: ReduxLogicDeps) {
        const { getState, action } = deps;
        const controller: SimulariumController = getSimulariumController(
            getState()
        );
        if (action.payload && controller) {
            controller.resume();
        } else if (controller) {
            controller.pause();
        }
    },
    type: SET_IS_PLAYING,
});

export default [setPlayingLogic];
