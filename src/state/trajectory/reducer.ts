import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    RECEIVE_TRAJECTORY,
    RECEIVE_AGENT_IDS,
    RECEIVE_AGENT_NAMES,
    RECEIVE_SIMULARIUM_FILE,
    CLEAR_SIMULARIUM_FILE,
    SET_CONVERSION_TEMPLATE,
    RECEIVE_FILE_TO_CONVERT,
    SET_CONVERSION_ENGINE,
    SET_CONVERSION_STATUS,
    CONVERT_FILE,
    RECEIVE_CONVERTED_FILE,
    SET_CONVERSION_TITLE,
} from "./constants";
import {
    TrajectoryStateBranch,
    ReceiveAction,
    ClearSimFileDataAction,
    SetConversionTemplateData,
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
    SetConversionStatusAction,
    ConversionStatus,
    ConvertFileAction,
    SetConversionTitleAction,
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
    conversionStatus: ConversionStatus.Inactive,
    processingData: {
        engineType: "",
        template: null,
        templateMap: null,
        fileToConvert: null,
        fileName: "",
        fileId: "",
        optionalTitle: "",
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
    [SET_CONVERSION_TEMPLATE]: {
        accepts: (action: AnyAction): action is SetConversionTemplateData =>
            action.type === SET_CONVERSION_TEMPLATE,
        perform: (
            state: TrajectoryStateBranch,
            action: SetConversionTemplateData
        ) => ({
            ...state,
            processingData: {
                ...state.processingData,
                ...action.payload,
            },
        }),
    },
    [SET_CONVERSION_STATUS]: {
        accepts: (action: AnyAction): action is SetConversionStatusAction =>
            action.type === SET_CONVERSION_STATUS,
        perform: (
            state: TrajectoryStateBranch,
            action: SetConversionStatusAction
        ) => ({
            ...state,
            conversionStatus: action.payload.status,
        }),
    },
    [SET_CONVERSION_ENGINE]: {
        accepts: (action: AnyAction): action is SetConversionEngineAction =>
            action.type === SET_CONVERSION_ENGINE,
        perform: (
            state: TrajectoryStateBranch,
            action: SetConversionEngineAction
        ) => ({
            ...state,
            processingData: {
                ...state.processingData,
                engineType: action.payload,
            },
        }),
    },
    [SET_CONVERSION_TITLE]: {
        accepts: (action: AnyAction): action is SetConversionTitleAction =>
            action.type === SET_CONVERSION_TITLE,
        perform: (
            state: TrajectoryStateBranch,
            action: SetConversionTitleAction
        ) => ({
            ...state,
            processingData: {
                ...state.processingData,
                optionalTitle: action.payload,
            },
        }),
    },
    [RECEIVE_FILE_TO_CONVERT]: {
        accepts: (action: AnyAction): action is ReceiveFileToConvertAction =>
            action.type === RECEIVE_FILE_TO_CONVERT,
        perform: (
            state: TrajectoryStateBranch,
            action: ReceiveFileToConvertAction
        ) => {
            return {
                ...state,
                processingData: {
                    ...state.processingData,
                    fileToConvert: action.payload.fileContents,
                    fileName: action.payload.fileName,
                },
            };
        },
    },
    [CONVERT_FILE]: {
        accepts: (action: AnyAction): action is ConvertFileAction =>
            action.type === CONVERT_FILE,
        perform: (state: TrajectoryStateBranch, action: ConvertFileAction) => {
            return {
                ...state,
                processingData: {
                    ...state.processingData,
                    fileId: action.payload,
                },
            };
        },
    },
    [RECEIVE_CONVERTED_FILE]: {
        accepts: (action: AnyAction): action is ReceiveAction =>
            action.type === RECEIVE_CONVERTED_FILE,
        perform: (state: TrajectoryStateBranch, action: ReceiveAction) => ({
            ...state,
            simulariumFile: action.payload,
            processingData: initialState.processingData,
        }),
    },
};

export default makeReducer<TrajectoryStateBranch>(
    actionToConfigMap,
    initialState
);
