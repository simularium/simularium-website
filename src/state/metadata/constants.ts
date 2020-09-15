import { makeConstant } from "../util";
const BRANCH_NAME = "metadata";
const makeMetadataConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const RECEIVE_METADATA = makeMetadataConstant("receive");
export const REQUEST_METADATA = makeMetadataConstant("request");
export const RECEIVE_AGENT_IDS = makeMetadataConstant("receive-ids");
export const RECEIVE_AGENT_NAMES = makeMetadataConstant("receive-agent-names");
export const RECEIVE_SIMULARIUM_FILE = makeMetadataConstant(
    "receive-simularium-file"
);
export const LOAD_LOCAL_FILE_IN_VIEWER = makeMetadataConstant(
    "load-local-file"
);
export const SET_SIMULARIUM_CONTROLLER = makeMetadataConstant(
    "set-sim-controller"
);
export const SET_VIEWER_STATUS = makeMetadataConstant("set-viewer-status");
export const LOAD_NETWORKED_FILE_IN_VIEWER = makeMetadataConstant(
    "load-networked-file"
);

export const VIEWER_EMPTY = "empty";
export const VIEWER_LOADING = "loading";
export const VIEWER_ERROR = "error";
export const VIEWER_SUCCESS = "success";
