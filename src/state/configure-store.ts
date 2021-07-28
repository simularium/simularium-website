import axios from "axios";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogicMiddleware } from "redux-logic";

import { BASE_API_URL, DATA_BUCKET_URL } from "../constants";

import {
    enableBatching,
    initialState,
    trajectory,
    selection,
    viewer,
    simularium,
    State,
} from "./";

const reducers = {
    trajectory: trajectory.reducer,
    selection: selection.reducer,
    viewer: viewer.reducer,
    simularium: simularium.reducer,
};

const logics = [
    ...trajectory.logics,
    ...selection.logics,
    ...viewer.logics,
    ...simularium.logics,
];

const reduxLogicDependencies = {
    baseApiUrl: BASE_API_URL,
    plotDataUrl: DATA_BUCKET_URL,
    httpClient: axios,
};

export default function createReduxStore(preloadedState?: State) {
    const logicMiddleware = createLogicMiddleware(logics);
    logicMiddleware.addDeps(reduxLogicDependencies);

    const middleware = applyMiddleware(logicMiddleware);
    const rootReducer = enableBatching<State>(
        combineReducers(reducers),
        initialState
    );

    if (preloadedState) {
        return createStore(rootReducer, preloadedState, middleware);
    }

    return createStore(rootReducer, middleware);
}
