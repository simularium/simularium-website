import { makeConstant } from "../util";
const BRANCH_NAME = "trajectory";
const makeTrajectoryConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const RECEIVE_TRAJECTORY = makeTrajectoryConstant("receive");
export const REQUEST_TRAJECTORY = makeTrajectoryConstant("request");
export const RECEIVE_AGENT_IDS = makeTrajectoryConstant("receive-ids");
export const RECEIVE_AGENT_NAMES = makeTrajectoryConstant(
    "receive-agent-names"
);
export const RECEIVE_SIMULARIUM_FILE = makeTrajectoryConstant(
    "receive-simularium-file"
);
export const LOAD_LOCAL_FILE_IN_VIEWER = makeTrajectoryConstant(
    "load-local-file"
);
export const LOAD_NETWORKED_FILE_IN_VIEWER = makeTrajectoryConstant(
    "load-networked-file"
);
export const REQUEST_PLOT_DATA = makeTrajectoryConstant("request-plot-data");
export const CLEAR_SIMULARIUM_FILE = makeTrajectoryConstant("clear-sim-file");
export const LOAD_FILE_VIA_URL = makeTrajectoryConstant("load-file-via-url");
