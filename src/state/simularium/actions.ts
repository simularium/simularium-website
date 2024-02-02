import { SimulariumController } from "@aics/simularium-viewer";

import { SET_SIMULARIUM_CONTROLLER } from "./constants";
import { SetSimulariumControllerAction } from "./types";

export function setSimulariumController(
    payload: SimulariumController
): SetSimulariumControllerAction {
    return {
        payload,
        type: SET_SIMULARIUM_CONTROLLER,
    };
}
