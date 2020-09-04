import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { receiveMetadata } from "./actions";
import { REQUEST_METADATA } from "./constants";
import { ReceiveAction } from "./types";

const requestMetadata = createLogic({
    process(
        deps: ReduxLogicDeps,
        dispatch: (action: ReceiveAction) => void,
        done: () => void
    ) {
        const { baseApiUrl, httpClient } = deps;
        httpClient
            .get(`${baseApiUrl}/metadata.json`)
            .then((metadata: AxiosResponse) => {
                dispatch(receiveMetadata({ graphData: metadata.data }));
            })
            .catch((reason) => {
                console.log(reason);
            })
            .then(done);
    },
    type: REQUEST_METADATA,
});

const requestMetadata = createLogic({
    process(
        deps: ReduxLogicDeps,
        dispatch: (action: ReceiveAction) => void,
        done: () => void
    ) {
        const { baseApiUrl, httpClient } = deps;
        httpClient
            .get(`${baseApiUrl}/metadata.json`)
            .then((metadata: AxiosResponse) => {
                dispatch(receiveMetadata({ graphData: metadata.data }));
            })
            .catch((reason) => {
                console.log(reason);
            })
            .then(done);
    },
    type: LOAD_LOCAL_FILE_IN_VIEWER,
});

export default [requestMetadata];
