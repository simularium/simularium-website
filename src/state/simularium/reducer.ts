import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import { SET_SIMULARIUM_CONTROLLER } from "./constants";
import { SimulariumStateBranch, ReceiveAction } from "./types";

export const initialState = {
    simulariumController: null,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [SET_SIMULARIUM_CONTROLLER]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === SET_SIMULARIUM_CONTROLLER,
        perform: (state: SimulariumStateBranch, action: ReceiveAction) => ({
            ...state,
            simulariumController: action.payload,
        }),
    },
};

export default makeReducer<SimulariumStateBranch>(
    actionToConfigMap,
    initialState
);
