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
export const TOGGLE_LOAD_FILE_MODAL = makeSelectConstant(
    "toggle-load-file-modal"
);
export const DRAG_OVER_VIEWER = makeSelectConstant("drag-over-viewer");
export const RESET_DRAG_OVER_VIEWER = makeSelectConstant("drag-off-viewer");
