import { RECEIVE_METADATA } from "./constants";
import { MetadataStateBranch } from "./types";

export function receiveMetadata(payload: MetadataStateBranch): ReceiveAction {
    return {
        payload,
        type: RECEIVE_METADATA,
    };
}
