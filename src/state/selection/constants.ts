import { makeConstant } from "../util";
const BRANCH_NAME = "selection";
const makeSelectConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const DESELECT_FILE = makeSelectConstant("deselect-file");
export const SELECT_FILE = makeSelectConstant("select-file");
export const SELECT_METADATA = makeSelectConstant("select_metadata");
export const CHANGE_TIME_HEAD = makeSelectConstant("change-time-head");
export const SIDE_PANEL_COLLAPSED = makeSelectConstant("change-content-width");
export const HIGHLIGHT_AGENTS_BY_KEY = makeSelectConstant(
    "highlight-agents-by-key"
);
export const TURN_AGENTS_ON_BY_KEY = makeSelectConstant(
    "turn-agents-on-by-name"
);
export const SET_AGENTS_VISIBLE = makeSelectConstant("set-agents-visible");
export const SET_ALL_AGENT_COLORS = makeSelectConstant("set-all-agent-colors");
export const CHANGE_AGENT_COLOR = makeSelectConstant("change-agent-color");
export const RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS = makeSelectConstant(
    "reset-selections-and-highlighted-agents"
);
