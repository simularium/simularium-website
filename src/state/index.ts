import { initialState as trajectoryInitialState } from "./trajectory/reducer";
import { initialState as selectionInitialState } from "./selection/reducer";
import { initialState as viewerInitialState } from "./viewer/reducer";
import { initialState as simulariumInitialState } from "./simularium/reducer";

import { State } from "./types";

export const initialState: State = Object.freeze({
    trajectory: trajectoryInitialState,
    selection: selectionInitialState,
    viewer: viewerInitialState,
    simularium: simulariumInitialState,
});

export { default as trajectory } from "./trajectory";
export { default as selection } from "./selection";
export { default as viewer } from "./viewer";
export { default as simularium } from "./simularium";
export { default as createReduxStore } from "./configure-store";
export { enableBatching } from "./util";
export { State } from "./types";
