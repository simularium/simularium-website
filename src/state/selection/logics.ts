import { SimulariumController } from "@aics/simularium-viewer/type-declarations";
import { createLogic } from "redux-logic";
import { getSimulariumController } from "../metadata/selectors";
import { ReduxLogicDeps } from "../types";
import { SET_IS_PLAYING } from "./constants";
import { getIsPlaying } from "./selectors";

const setPlayingLogic = createLogic({
    process(deps: ReduxLogicDeps) {
        const { getState, action } = deps;
        const controller: SimulariumController = getSimulariumController(
            getState()
        );
        const currentlyIsPlaying = getIsPlaying(getState());
        console.log(
            "currently is playing",
            currentlyIsPlaying,
            "set play",
            action.payload
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
