import { RECEIVE_METADATA } from "./constants";
import { TrajectoryStateBranch } from "./types";

export function receiveMetadata(payload: TrajectoryStateBranch): ReceiveAction {
    return {
        payload,
        type: RECEIVE_METADATA,
    };
}
