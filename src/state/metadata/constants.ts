import { makeConstant } from "../util";
const BRANCH_NAME = "metadata";

export const RECEIVE_METADATA = makeConstant(BRANCH_NAME, "receive");
export const REQUEST_METADATA = makeConstant(BRANCH_NAME, "request");
export const RECEIVE_AGENT_IDS = makeConstant(BRANCH_NAME, "receive-ids");
