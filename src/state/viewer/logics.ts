import { AxiosResponse } from "axios";
import { createLogic } from "redux-logic";
import queryString from "query-string";
// NOTE: importing @aics/simularium-viewer here currently breaks ability to compile in testing setup
// TODO: work on test babel setup, or switch to jest?

import { ReduxLogicDeps } from "../types";
import { batchActions } from "../util";

import { getSimulariumController } from "./selectors";
import { receiveMetadata } from "./actions";
import { LOAD_LOCAL_FILE_IN_VIEWER } from "./constants";
import { ReceiveAction } from "./types";
import { initialState } from "./reducer";

const netConnectionSettings = {
    serverIp: process.env.BACKEND_SERVER_IP,
    serverPort: 9002,
};

const resetSimulariumFileState = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState, action } = deps;
        const controller = getSimulariumController(getState());

        const resetTime = changeTime(initialSelectionState.time);
        const resetVisibility = resetAgentSelectionsAndHighlights();
        const stopPlay = setIsPlaying(false);
        let clearMetaData;

        const actions = [resetTime, resetVisibility, stopPlay];

        if (!action.payload.newFile) {
            //only clear controller if not requesting new sim file
            if (controller) {
                controller.clearFile();
            }
            clearMetaData = receiveMetadata({
                plotData: initialState.plotData,
                firstFrameTime: initialState.firstFrameTime,
                lastFrameTime: initialState.lastFrameTime,
                timeStep: initialState.timeStep,
                agentUiNames: initialState.agentUiNames,
            });
            const setViewerStatusAction = setViewerStatus({
                status: VIEWER_EMPTY,
            });
            actions.push(setViewerStatusAction);
        } else {
            dispatch(
                setViewerStatus({
                    status: VIEWER_LOADING,
                })
            );
            // plot data is a separate request, clear it out to avoid
            // wrong plot data sticking around if the request fails
            clearMetaData = receiveMetadata({
                plotData: initialState.plotData,
            });
        }
        actions.push(clearMetaData);
        dispatch(batchActions(actions));
        done();
    },
    type: [CLEAR_SIMULARIUM_FILE],
});

export default [requestPlotDataLogic];
