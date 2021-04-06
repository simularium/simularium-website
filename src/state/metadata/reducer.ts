import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    RECEIVE_METADATA,
    RECEIVE_AGENT_IDS,
    RECEIVE_AGENT_NAMES,
    RECEIVE_SIMULARIUM_FILE,
    SET_SIMULARIUM_CONTROLLER,
    SET_VIEWER_STATUS,
    VIEWER_ERROR,
    VIEWER_EMPTY,
    CLEAR_SIMULARIUM_FILE,
} from "./constants";
import {
    MetadataStateBranch,
    ReceiveAction,
    ClearSimFileDataAction,
    SetViewerStatusAction,
} from "./types";

export const initialState = {
    firstFrameTime: 0,
    lastFrameTime: 0,
    timeStep: 0,
    timeUnits: null,
    agentIds: [],
    agentUiNames: [],
    plotData: [],
    simulariumFile: {
        name: "",
        data: null,
        lastModified: null,
    },
    simulariumController: null,
    viewerStatus: VIEWER_EMPTY,
    viewerError: null,
};

const actionToConfigMap: TypeToDescriptionMap = {
    [RECEIVE_METADATA]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_METADATA,
        perform: (state: MetadataStateBranch, action: ReceiveAction) => ({
            ...state,
            ...action.payload,
        }),
    },
    [RECEIVE_AGENT_IDS]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_AGENT_IDS,
        perform: (state: MetadataStateBranch, action: ReceiveAction) => ({
            ...state,
            agentIds: action.payload,
        }),
    },
    [RECEIVE_AGENT_NAMES]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_AGENT_NAMES,
        perform: (state: MetadataStateBranch, action: ReceiveAction) => ({
            ...state,
            agentUiNames: action.payload,
        }),
    },
    [RECEIVE_SIMULARIUM_FILE]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_SIMULARIUM_FILE,
        perform: (state: MetadataStateBranch, action: ReceiveAction) => ({
            ...state,
            simulariumFile: action.payload,
        }),
    },
    [CLEAR_SIMULARIUM_FILE]: {
        accepts: (action: AnyAction): action is ClearSimFileDataAction =>
            action.type === CLEAR_SIMULARIUM_FILE,
        perform: (state: MetadataStateBranch) => ({
            ...state,
            simulariumFile: initialState.simulariumFile,
        }),
    },
    [SET_SIMULARIUM_CONTROLLER]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === SET_SIMULARIUM_CONTROLLER,
        perform: (state: MetadataStateBranch, action: ReceiveAction) => ({
            ...state,
            simulariumController: action.payload,
        }),
    },
    [SET_VIEWER_STATUS]: {
        accepts: (action: AnyAction): action is SetViewerStatusAction =>
            action.type === SET_VIEWER_STATUS,
        perform: (
            state: MetadataStateBranch,
            action: SetViewerStatusAction
        ) => ({
            ...state,
            viewerStatus: action.payload.status,
            viewerError:
                action.payload.status === VIEWER_ERROR
                    ? {
                          message: action.payload.errorMessage,
                          htmlData: action.payload.htmlData,
                          onClose: action.payload.onClose,
                      }
                    : "",
        }),
    },
};

export default makeReducer<MetadataStateBranch>(
    actionToConfigMap,
    initialState
);
