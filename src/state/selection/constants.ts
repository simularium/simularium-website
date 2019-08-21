import { makeConstant } from "../util";
const BRANCH_NAME = "selection";

export const DESELECT_FILE = makeConstant(BRANCH_NAME, "deselect-file");
export const SELECT_FILE = makeConstant(BRANCH_NAME, "select-file");
export const SELECT_METADATA = makeConstant(BRANCH_NAME, "select_metadata");
export const CHANGE_TIME_HEAD = makeConstant(BRANCH_NAME, "change-time-head");
