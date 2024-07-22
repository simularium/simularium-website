import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    RECEIVE_TRAJECTORY,
    RECEIVE_AGENT_IDS,
    RECEIVE_SIMULARIUM_FILE,
    CLEAR_SIMULARIUM_FILE,
    SET_CONVERSION_TEMPLATE,
    RECEIVE_FILE_TO_CONVERT,
    SET_CONVERSION_ENGINE,
    SET_CONVERSION_STATUS,
    CONVERT_FILE,
    RECEIVE_CONVERTED_FILE,
    SET_DEFAULT_UI_DATA,
    SET_USER_SELECTED_UI_DATA,
    SET_CURRENT_COLOR_SETTINGS,
    CLEAR_UI_DATA_FROM_STATE,
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
    SetUserSelectedUIDataAction,
    SetDefaultUIDataAction,
    SetCurrentColorSettingsAction,
    ColorSettings,
    ClearUIDataAction,
} from "./types";

export const initialState = {
    firstFrameTime: 0,
    lastFrameTime: 0,
    timeStep: 0,
    timeUnits: null,
    scaleBarLabel: "",
    agentIds: [],
    userSelectedUIData: [],
    defaultUIData: [],
    currentColorSettings: ColorSettings.Default,
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
        }),
    },
    [SET_USER_SELECTED_UI_DATA]: {
        accepts: (action: AnyAction): action is SetUserSelectedUIDataAction =>
            action.type === SET_USER_SELECTED_UI_DATA,
        perform: (
            state: TrajectoryStateBranch,
            action: SetUserSelectedUIDataAction
        ) => {
            return {
                ...state,
                userSelectedUIData: action.payload,
            };
        },
    },
    [SET_DEFAULT_UI_DATA]: {
        accepts: (action: AnyAction): action is SetDefaultUIDataAction =>
            action.type === SET_DEFAULT_UI_DATA,
        perform: (
            state: TrajectoryStateBranch,
            action: SetDefaultUIDataAction
        ) => {
            return {
                ...state,
                defaultUIData: action.payload,
            };
        },
    },
    [SET_CURRENT_COLOR_SETTINGS]: {
        accepts: (action: AnyAction): action is SetCurrentColorSettingsAction =>
            action.type === SET_CURRENT_COLOR_SETTINGS,
        perform: (
            state: TrajectoryStateBranch,
            action: SetCurrentColorSettingsAction
        ) => {
            return {
                ...state,
                currentColorSettings: action.payload,
            };
        },
    },
    [CLEAR_UI_DATA_FROM_STATE]: {
        accepts: (action: AnyAction): action is ClearUIDataAction =>
            action.type === CLEAR_UI_DATA_FROM_STATE,
        perform: (state: TrajectoryStateBranch) => {
            return {
                ...state,
                userSelectedUIData: [],
                defaultUIData: [],
                currentColorSettings: ColorSettings.Default,
            };
        },
    },
};

export default makeReducer<TrajectoryStateBranch>(
    actionToConfigMap,
    initialState
);
