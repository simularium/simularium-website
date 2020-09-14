import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { getSimulariumController, getSimulariumFile } from "./selectors";
import { receiveMetadata, receiveSimulariumFile } from "./actions";
import {
    REQUEST_METADATA,
    LOAD_LOCAL_FILE_IN_VIEWER,
    VIEWER_LOADING,
    VIEWER_SUCCESS,
    LOAD_NETWORKED_FILE_IN_VIEWER,
} from "./constants";
import { ReceiveAction, LocalSimFile, NetworkedSimFile } from "./types";
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
                dispatch(receiveMetadata({ plotData: metadata.data }));
            })
            .catch((reason) => {
                console.log(reason);
            })
            .then(done);
    },
    type: REQUEST_METADATA,
});

const loadNetworkedFile = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const currentState = getState();
        const simulariumController = getSimulariumController(currentState);
        if (!simulariumController) {
            console.log("no controller");
        }
        const lastSimulariumFile:
            | LocalSimFile
            | NetworkedSimFile = getSimulariumFile(currentState);
        const simulariumFile = action.payload;
        if (lastSimulariumFile) {
            if (
                // for networked files, only check same file name
                lastSimulariumFile.name === simulariumFile.name
            ) {
                // exact same file loaded again, dont need to reload anything
                return done();
            }
        }
        dispatch(setViewerStatus({ status: VIEWER_LOADING }));
        simulariumController
            .changeFile(simulariumFile.name)
            .then(() => {
                dispatch(receiveSimulariumFile(simulariumFile));
            })
            .then(() => {
                dispatch(
                    receiveMetadata({
                        plotData: simulariumFile.data.plotData.data,
                    })
                );
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
    type: LOAD_NETWORKED_FILE_IN_VIEWER,
});

const loadLocalFile = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const currentState = getState();
        const simulariumController = getSimulariumController(currentState);
        const lastSimulariumFile: LocalSimFile = getSimulariumFile(
            currentState
        );
        const simulariumFile = action.payload;
        if (lastSimulariumFile) {
            if (
                lastSimulariumFile.name === simulariumFile.name &&
                lastSimulariumFile.lastModified === simulariumFile.lastModified
            ) {
                // exact same file loaded again, dont need to reload anything
                return;
            }
        }
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

export default [requestMetadata, loadLocalFile, loadNetworkedFile];
