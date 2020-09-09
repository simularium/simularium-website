import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
    RECEIVE_AGENT_IDS,
    RECEIVE_AGENT_NAMES,
    RECEIVE_SIMULARIUM_FILE,
    SET_SIMULARIUM_CONTROLLER,
    LOAD_LOCAL_FILE_IN_VIEWER,
    SET_VIEWER_STATUS,
} from "./constants";
import {
    MetadataStateBranch,
    ReceiveAction,
    RequestAction,
    SetSimulariumControllerAction,
    VIEWER_STATUS,
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

export function changeLocalSimulariumFile(payload: {
    data: SimulariumFileFormat;
    name: string;
}): ReceiveAction {
    return {
        payload,
        type: LOAD_LOCAL_FILE_IN_VIEWER,
    };
}

export function receiveSimulariumFile(payload: {
    data: SimulariumFileFormat;
    name: string;
}): ReceiveAction {
    return {
        payload,
        type: RECEIVE_SIMULARIUM_FILE,
    };
}

export function setViewerStatus(payload: {
    status: VIEWER_STATUS;
    errorMessage?: string;
}) {
    return {
        payload,
        type: SET_VIEWER_STATUS,
    };
}
