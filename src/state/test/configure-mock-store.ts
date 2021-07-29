import { AxiosInstance } from "axios";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogicMiddleware } from "redux-logic";
import { SinonStub } from "sinon";

import {
    enableBatching,
    initialState,
    trajectory,
    selection,
    viewer,
    simularium,
    State,
} from "../";

export interface ReduxLogicDependencies {
    baseApiUrl: string;
    httpClient: AxiosInstance & {
        get: SinonStub;
    };
}

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

export function createReduxStore(
    preloadedState: State,
    reduxLogicDependencies: ReduxLogicDependencies
) {
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
