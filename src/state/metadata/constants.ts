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
export const LOAD_NETWORKED_FILE_IN_VIEWER = makeMetadataConstant(
    "load-networked-file"
);
export const REQUEST_PLOT_DATA = makeMetadataConstant("request-plot-data");
export const CLEAR_SIMULARIUM_FILE = makeMetadataConstant("clear-sim-file");
export const LOAD_FILE_VIA_URL = makeMetadataConstant("load-file-via-url");
