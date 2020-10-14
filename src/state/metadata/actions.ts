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
} from "./constants";
import {
    MetadataStateBranch,
    ReceiveAction,
    RequestAction,
    SetSimulariumControllerAction,
    LocalSimFile,
    NetworkedSimFile,
    RequestFileAction,
    RequestCachedPlotAction,
    ViewerStatusInfo,
    SetViewerStatusAction,
} from "./types";
import {
    SimulariumFileFormat,
    SimulariumController,
} from "@aics/simularium-viewer/type-declarations";

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

export function changeToLocalSimulariumFile(payload: {
    data: SimulariumFileFormat;
    name: string;
}): RequestFileAction {
    return {
        payload,
        type: LOAD_LOCAL_FILE_IN_VIEWER,
    };
}

export function changeToNetworkedFile(
    payload: NetworkedSimFile,
    controller?: SimulariumController
): RequestFileAction {
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

export function setViewerStatus(
    payload: ViewerStatusInfo
): SetViewerStatusAction {
    return {
        payload,
        type: SET_VIEWER_STATUS,
    };
}
