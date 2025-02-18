import { SimulariumController, UIDisplayData } from "@aics/simularium-viewer";

import {
    RECEIVE_TRAJECTORY,
    REQUEST_TRAJECTORY,
    RECEIVE_AGENT_IDS,
    RECEIVE_SIMULARIUM_FILE,
    LOAD_LOCAL_FILE_IN_VIEWER,
    LOAD_NETWORKED_FILE_IN_VIEWER,
    REQUEST_PLOT_DATA,
    CLEAR_SIMULARIUM_FILE,
    LOAD_FILE_VIA_URL,
    SET_URL_PARAMS,
    INITIALIZE_CONVERSION,
    SET_CONVERSION_ENGINE,
    RECEIVE_FILE_TO_CONVERT,
    SET_CONVERSION_STATUS,
    CONVERT_FILE,
    RECEIVE_CONVERTED_FILE,
    CANCEL_CONVERSION,
    SET_CONVERSION_TITLE,
    SET_DEFAULT_UI_DATA,
} from "./constants";
import { AvailableEngines } from "./conversion-data-types";
import {
    TrajectoryStateBranch,
    ReceiveAction,
    RequestAction,
    LocalSimFile,
    NetworkedSimFile,
    RequestCachedPlotAction,
    RequestNetworkFileAction,
    RequestLocalFileAction,
    ClearSimFileDataAction,
    LoadViaUrlAction,
    SetUrlParamsAction,
    InitializeConversionAction,
    SetConversionEngineAction,
    ReceiveFileToConvertAction,
    SetConversionStatusAction,
    ConvertFileAction,
    ConversionStatus,
    CancelConversionAction,
    SetConversionTitleAction,
    SetDefaultUIDataAction,
} from "./types";

export function receiveTrajectory(
    payload: TrajectoryStateBranch
): ReceiveAction {
    return {
        payload,
        type: RECEIVE_TRAJECTORY,
    };
}

export function requestTrajectory(): RequestAction {
    return {
        type: REQUEST_TRAJECTORY,
    };
}

export function requestCachedPlotData(payload: {
    url: string;
}): RequestCachedPlotAction {
    return {
        payload,
        type: REQUEST_PLOT_DATA,
    };
}

export function receiveAgentTypeIds(
    payload: TrajectoryStateBranch
): ReceiveAction {
    return {
        payload,
        type: RECEIVE_AGENT_IDS,
    };
}

export function changeToLocalSimulariumFile(
    payload: LocalSimFile,
    controller?: SimulariumController
): RequestLocalFileAction {
    return {
        payload,
        controller,
        type: LOAD_LOCAL_FILE_IN_VIEWER,
    };
}

export function changeToNetworkedFile(
    payload: NetworkedSimFile,
    controller?: SimulariumController
): RequestNetworkFileAction {
    return {
        payload,
        controller,
        type: LOAD_NETWORKED_FILE_IN_VIEWER,
    };
}

export function receiveSimulariumFile(
    payload: LocalSimFile | NetworkedSimFile
): ReceiveAction {
    return {
        payload,
        type: RECEIVE_SIMULARIUM_FILE,
    };
}

export function clearSimulariumFile(payload: {
    newFile: boolean;
}): ClearSimFileDataAction {
    return {
        payload,
        type: CLEAR_SIMULARIUM_FILE,
    };
}

export function loadViaUrl(
    payload: string,
    controller?: SimulariumController,
    fileId?: string
): LoadViaUrlAction {
    return {
        payload,
        controller,
        type: LOAD_FILE_VIA_URL,
        fileId,
    };
}

export function setUrlParams(): SetUrlParamsAction {
    return {
        type: SET_URL_PARAMS,
    };
}

export function setConversionStatus(payload: {
    status: ConversionStatus;
}): SetConversionStatusAction {
    return {
        payload,
        type: SET_CONVERSION_STATUS,
    };
}

export function initializeConversion(): InitializeConversionAction {
    return {
        type: INITIALIZE_CONVERSION,
    };
}

export function receiveFileToConvert(
    fileContents: string,
    fileName: string
): ReceiveFileToConvertAction {
    return {
        type: RECEIVE_FILE_TO_CONVERT,
        payload: { fileContents, fileName },
    };
}

export function setConversionEngine(
    payload: AvailableEngines
): SetConversionEngineAction {
    return {
        payload,
        type: SET_CONVERSION_ENGINE,
    };
}

export function setConversionTitle(payload: string): SetConversionTitleAction {
    return {
        payload,
        type: SET_CONVERSION_TITLE,
    };
}

export function convertFile(payload: { fileId: string }): ConvertFileAction {
    return {
        payload,
        type: CONVERT_FILE,
    };
}

export function receiveConvertedFile(payload: NetworkedSimFile): ReceiveAction {
    return {
        payload,
        type: RECEIVE_CONVERTED_FILE,
    };
}

export function cancelAutoconversion(): CancelConversionAction {
    return {
        type: CANCEL_CONVERSION,
    };
}

export function setDefaultUIData(
    payload: UIDisplayData
): SetDefaultUIDataAction {
    return {
        payload,
        type: SET_DEFAULT_UI_DATA,
    };
}
