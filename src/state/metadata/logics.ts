import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { getSimulariumController } from "./selectors";
import { receiveMetadata, receiveSimulariumFile } from "./actions";
import {
    REQUEST_METADATA,
    LOAD_LOCAL_FILE_IN_VIEWER,
    VIEWER_LOADING,
    VIEWER_SUCCESS,
} from "./constants";
import { ReceiveAction } from "./types";
import { VIEWER_ERROR } from "./constants";
import { setViewerStatus } from "../metadata/actions";

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

const loadLocalFile = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const simulariumController = getSimulariumController(getState());
        const simulariumFile = action.payload;
        dispatch(setViewerStatus({ status: VIEWER_LOADING }));
        simulariumController
            .changeFile(simulariumFile.name, true, simulariumFile.data)
            .then(() => {
                dispatch(receiveSimulariumFile(simulariumFile));
            })
            .then(() => {
                dispatch(
                    setViewerStatus({
                        status: VIEWER_SUCCESS,
                    })
                );
            })
            .then(done)
            .catch((error: Error) => {
                dispatch(
                    setViewerStatus({
                        status: VIEWER_ERROR,
                        errorMessage: error.message,
                    })
                );
            });
    },
    type: LOAD_LOCAL_FILE_IN_VIEWER,
});

export default [requestMetadata, loadLocalFile];
