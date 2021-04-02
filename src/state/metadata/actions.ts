import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
    RECEIVE_AGENT_IDS,
    RECEIVE_AGENT_NAMES,
    RECEIVE_SIMULARIUM_FILE,
    SET_SIMULARIUM_CONTROLLER,
    LOAD_LOCAL_FILE_IN_VIEWER,
    SET_VIEWER_STATUS,
    LOAD_NETWORKED_FILE_IN_VIEWER,
    REQUEST_PLOT_DATA,
    CLEAR_SIMULARIUM_FILE,
    LOAD_FILE_VIA_URL,
} from "./constants";
import {
    MetadataStateBranch,
    ReceiveAction,
    RequestAction,
    SetSimulariumControllerAction,
    LocalSimFile,
    NetworkedSimFile,
    RequestCachedPlotAction,
    ViewerStatusInfo,
    SetViewerStatusAction,
    RequestNetworkFileAction,
    RequestLocalFileAction,
    ClearSimFileDataAction,
    LoadViaUrlAction,
} from "./types";
import { SimulariumController } from "@aics/simularium-viewer/type-declarations";

export function receiveMetadata(payload: MetadataStateBranch): ReceiveAction {
    return {
        payload,
        type: RECEIVE_METADATA,
    };
}

export function requestMetadata(): RequestAction {
    return {
        type: REQUEST_METADATA,
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

export function setSimulariumController(
    payload: SimulariumController
): SetSimulariumControllerAction {
    return {
        payload,
        type: SET_SIMULARIUM_CONTROLLER,
    };
}

export function receiveAgentTypeIds(
    payload: MetadataStateBranch
): ReceiveAction {
    return {
        payload,
        type: RECEIVE_AGENT_IDS,
    };
}

export function receiveAgentNamesAndStates(
    payload: MetadataStateBranch
): ReceiveAction {
    return {
        payload,
        type: RECEIVE_AGENT_NAMES,
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

export function setViewerStatus(
    payload: ViewerStatusInfo
): SetViewerStatusAction {
    return {
        payload,
        type: SET_VIEWER_STATUS,
    };
}

export function loadViaUrl(
    payload: string,
    controller?: SimulariumController
): LoadViaUrlAction {
    return {
        payload,
        controller,
        type: LOAD_FILE_VIA_URL,
    };
}
