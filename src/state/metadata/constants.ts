import { makeConstant } from "../util";
const BRANCH_NAME = "metadata";
const makeMetadataConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const RECEIVE_METADATA = makeMetadataConstant("receive");
export const REQUEST_METADATA = makeMetadataConstant("request");
export const RECEIVE_AGENT_IDS = makeMetadataConstant("receive-ids");
export const RECEIVE_AGENT_NAMES = makeMetadataConstant("receive-agent-names");
