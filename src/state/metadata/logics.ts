import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";

import { ReduxLogicDeps } from "../types";

import { getSimulariumController } from "./selectors";
import { receiveMetadata, receiveSimulariumFile } from "./actions";
import { REQUEST_METADATA, LOAD_LOCAL_FILE_IN_VIEWER } from "./constants";
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

const loadLocalFile = createLogic({
    process(
        deps: ReduxLogicDeps,
        dispatch: (action: ReceiveAction) => void,
        done: () => void
    ) {
        const { action, getState } = deps;
        const simulariumController = getSimulariumController(getState());
        const simulariumFile = action.payload;
        simulariumController.changeFile(
            simulariumFile.name,
            true,
            simulariumFile.data
        );
        // .catch((reason) => {
        //     console.log(reason);
        // })
        // .then(done);
        receiveSimulariumFile(simulariumFile);
    },
    type: LOAD_LOCAL_FILE_IN_VIEWER,
});

export default [requestMetadata, loadLocalFile];
