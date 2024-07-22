import { makeConstant } from "../util";

const BRANCH_NAME = "trajectory";
const makeTrajectoryConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const RECEIVE_TRAJECTORY = makeTrajectoryConstant("receive");
export const REQUEST_TRAJECTORY = makeTrajectoryConstant("request");
export const RECEIVE_AGENT_IDS = makeTrajectoryConstant("receive-ids");
export const RECEIVE_SIMULARIUM_FILE = makeTrajectoryConstant(
    "receive-simularium-file"
);
export const LOAD_LOCAL_FILE_IN_VIEWER =
    makeTrajectoryConstant("load-local-file");
export const LOAD_NETWORKED_FILE_IN_VIEWER = makeTrajectoryConstant(
    "load-networked-file"
);
export const REQUEST_PLOT_DATA = makeTrajectoryConstant("request-plot-data");
export const CLEAR_SIMULARIUM_FILE = makeTrajectoryConstant("clear-sim-file");
export const LOAD_FILE_VIA_URL = makeTrajectoryConstant("load-file-via-url");
export const SET_URL_PARAMS = makeTrajectoryConstant("set-url-params");
export const INITIALIZE_CONVERSION = makeTrajectoryConstant(
    "initalize-conversion"
);
export const SET_CONVERSION_ENGINE = makeTrajectoryConstant(
    "set-conversion-engine"
);
export const SET_CONVERSION_TEMPLATE = makeTrajectoryConstant(
    "set-conversion-template"
);
export const RECEIVE_FILE_TO_CONVERT = makeTrajectoryConstant(
    "receive-file-to-convert"
);
export const CONVERT_FILE = makeTrajectoryConstant("convert-file");
export const RECEIVE_CONVERTED_FILE =
    makeTrajectoryConstant("receive-converted");
export const CANCEL_CONVERSION = makeTrajectoryConstant("cancel-conversion");
export const SET_USER_SELECTED_UI_DATA = makeTrajectoryConstant(
    "set-session-ui-data"
);
export const SET_DEFAULT_UI_DATA = makeTrajectoryConstant(
    "set-default-ui-data"
);

export const SET_CONVERSION_STATUS = makeTrajectoryConstant("set-status");
export const SET_CURRENT_COLOR_SETTINGS =
    makeTrajectoryConstant("set-apply-colors");
export const CLEAR_UI_DATA_FROM_STATE = makeTrajectoryConstant("clear-ui-data");
