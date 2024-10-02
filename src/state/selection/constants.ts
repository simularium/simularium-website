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
export const RESET_AGENT_SELECTIONS_AND_HIGHLIGHTS = makeSelectConstant(
    "reset-selections-and-highlighted-agents"
);
export const SET_RECENT_COLORS = makeSelectConstant("set-recent-colors");
export const SET_SELECTED_AGENT = makeSelectConstant("set-selected-agent");
export const APPLY_USER_COLOR_SELECTION = makeSelectConstant(
    "apply-user-color-selection"
);
export const GET_COLOR_SELECTIONS_FROM_BROWSER = makeSelectConstant(
    "get-ui-data-from-browser"
);
export const CLEAR_COLOR_SELECTIONS_FROM_BROWSER_AND_STATE = makeSelectConstant(
    "clear-color-selections-from-browser"
);
export const SET_USER_COLOR_SELECTIONS = makeSelectConstant(
    "set-user-color-selections"
);
export const SET_CURRENT_COLOR_SETTINGS = makeSelectConstant(
    "set-current-color-settings"
);
export const CLEAR_COLOR_SELECTIONS_FROM_STATE = makeSelectConstant(
    "reset-color-selection-state"
);
