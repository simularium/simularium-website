import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    RECEIVE_TRAJECTORY,
    RECEIVE_AGENT_IDS,
    RECEIVE_AGENT_NAMES,
    RECEIVE_SIMULARIUM_FILE,
    CLEAR_SIMULARIUM_FILE,
    SET_URL_PARAMS,
} from "./constants";
import {
    TrajectoryStateBranch,
    ReceiveAction,
    ClearSimFileDataAction,
    SetUrlParamsAction,
} from "./types";

export const initialState = {
    firstFrameTime: 0,
    lastFrameTime: 0,
    timeStep: 0,
    timeUnits: null,
    scaleBarLabel: "",
    agentIds: [],
    agentUiNames: [],
    plotData: [],
    simulariumFile: {
        name: "",
        data: null,
        lastModified: null,
    },
};

const actionToConfigMap: TypeToDescriptionMap = {
    [RECEIVE_TRAJECTORY]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_TRAJECTORY,
        perform: (state: TrajectoryStateBranch, action: ReceiveAction) => ({
            ...state,
            ...action.payload,
        }),
    },
    [RECEIVE_AGENT_IDS]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_AGENT_IDS,
        perform: (state: TrajectoryStateBranch, action: ReceiveAction) => ({
            ...state,
            agentIds: action.payload,
        }),
    },
    [RECEIVE_AGENT_NAMES]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_AGENT_NAMES,
        perform: (state: TrajectoryStateBranch, action: ReceiveAction) => ({
            ...state,
            agentUiNames: action.payload,
        }),
    },
    [RECEIVE_SIMULARIUM_FILE]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_SIMULARIUM_FILE,
        perform: (state: TrajectoryStateBranch, action: ReceiveAction) => ({
            ...state,
            simulariumFile: action.payload,
        }),
    },
    [CLEAR_SIMULARIUM_FILE]: {
        accepts: (action: AnyAction): action is ClearSimFileDataAction =>
            action.type === CLEAR_SIMULARIUM_FILE,
        perform: (state: TrajectoryStateBranch) => ({
            ...state,
            simulariumFile: initialState.simulariumFile,
        }),
    },
    [SET_URL_PARAMS]: {
        accepts: (action: AnyAction): action is SetUrlParamsAction =>
            action.type === SET_URL_PARAMS,
        perform: (state: TrajectoryStateBranch) => ({
            ...state,
        }),
    },
};

export default makeReducer<TrajectoryStateBranch>(
    actionToConfigMap,
    initialState
);
