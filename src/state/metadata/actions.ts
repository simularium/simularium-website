import {
    RECEIVE_METADATA,
    REQUEST_METADATA,
    RECEIVE_AGENT_IDS,
} from "./constants";
import { MetadataStateBranch, ReceiveAction, RequestAction } from "./types";

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

export function receiveAgentTypeIds(
    payload: MetadataStateBranch
): ReceiveAction {
    return {
        payload,
        type: RECEIVE_AGENT_IDS,
    };
}
