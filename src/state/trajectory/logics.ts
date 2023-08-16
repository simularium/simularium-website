import { AxiosResponse } from "axios";
import { batch } from "react-redux";
import { createLogic } from "redux-logic";
import { ArgumentAction } from "redux-logic/definitions/action";
import queryString from "query-string";
import {
    ErrorLevel,
    FrontEndError,
    loadSimulariumFile,
} from "@aics/simularium-viewer";

import { URL_PARAM_KEY_FILE_NAME, URL_PARAM_KEY_TIME } from "../../constants";
import { clearBrowserUrlParams } from "../../util";
import { getUserTrajectoryUrl } from "../../util/userUrlHandling";
import {
    VIEWER_LOADING,
    VIEWER_EMPTY,
    VIEWER_ERROR,
} from "../viewer/constants";
import {
    changeTime,
    resetAgentSelectionsAndHighlights,
} from "../selection/actions";
import { setSimulariumController } from "../simularium/actions";
import { getSimulariumController } from "../simularium/selectors";
import { initialState as initialSelectionState } from "../selection/reducer";
import { setStatus, setIsPlaying, setError } from "../viewer/actions";
import { ReduxLogicDeps } from "../types";
import { batchActions } from "../util";

import { getSimulariumFile } from "./selectors";
import {
    changeToLocalSimulariumFile,
    receiveTrajectory,
    receiveSimulariumFile,
    requestCachedPlotData,
    clearSimulariumFile,
} from "./actions";
import {
    LOAD_LOCAL_FILE_IN_VIEWER,
    LOAD_NETWORKED_FILE_IN_VIEWER,
    REQUEST_PLOT_DATA,
    CLEAR_SIMULARIUM_FILE,
    LOAD_FILE_VIA_URL,
    SET_URL_PARAMS,
} from "./constants";
import { ReceiveAction, LocalSimFile } from "./types";
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
        let clearTrajectory;

        const actions = [resetTime, resetVisibility, stopPlay];

        if (!action.payload.newFile) {
            //only clear controller if not requesting new sim file
            if (controller) {
                controller.clearFile();
            }
            clearTrajectory = receiveTrajectory({ ...initialState });
            const setViewerStatusAction = setStatus({
                status: VIEWER_EMPTY,
            });
            actions.push(setViewerStatusAction);
        } else {
            const setViewerStatusAction = setStatus({
                status: VIEWER_LOADING,
            });
            actions.push(setViewerStatusAction);
            // plot data is a separate request, clear it out to avoid
            // wrong plot data sticking around if the request fails
            clearTrajectory = receiveTrajectory({
                plotData: initialState.plotData,
            });
        }
        actions.push(clearTrajectory);
        dispatch(batchActions(actions));
        done();
    },
    type: [CLEAR_SIMULARIUM_FILE],
});

const requestPlotDataLogic = createLogic({
    process(
        deps: ReduxLogicDeps,
        dispatch: (action: ReceiveAction) => void,
        done: () => void
    ) {
        const { baseApiUrl, plotDataUrl, httpClient, action } = deps;
        httpClient
            .get(`${plotDataUrl}${baseApiUrl}/${action.payload.url}`)
            .then((trajectory: AxiosResponse) => {
                dispatch(receiveTrajectory({ plotData: trajectory.data.data }));
            })
            .catch((reason) => {
                console.log(reason);
            })
            .then(done);
    },
    type: REQUEST_PLOT_DATA,
});

const handleFileLoadError = (
    error: FrontEndError,
    dispatch: <T extends ArgumentAction<string, undefined, undefined>>(
        action: T
    ) => T
) => {
    batch(() => {
        dispatch(
            setError({
                level: error.level,
                message: error.message,
                htmlData: error.htmlData || "",
            })
        );
        if (error.level === ErrorLevel.ERROR) {
            dispatch(setStatus({ status: VIEWER_ERROR }));
            dispatch(clearSimulariumFile({ newFile: false }));
        }
    });

    if (error.level === ErrorLevel.ERROR) {
        clearBrowserUrlParams();
    }
};

const loadNetworkedFile = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const currentState = getState();

        const simulariumFile = action.payload;
        batch(() => {
            dispatch(
                setStatus({
                    status: VIEWER_LOADING,
                })
            );
            dispatch({
                payload: { newFile: true },
                type: CLEAR_SIMULARIUM_FILE,
            });
        });

        let simulariumController = getSimulariumController(currentState);
        if (!simulariumController) {
            if (action.controller) {
                simulariumController = action.controller;
                dispatch(setSimulariumController(simulariumController));
            }
        }
        if (!simulariumController.netConnection) {
            simulariumController.configureNetwork(netConnectionSettings);
        }

        simulariumController
            .changeFile(
                {
                    netConnectionSettings: netConnectionSettings,
                },
                simulariumFile.name
            )
            .then(() => {
                return dispatch(receiveSimulariumFile(simulariumFile));
            })
            .then(() => {
                return dispatch(
                    requestCachedPlotData({
                        url: `${
                            simulariumFile.name.split(".")[0]
                        }/plot-data.json`, // placeholder for however we organize this data in s3
                    })
                );
            })
            .then(done)
            .catch((error: FrontEndError) => {
                handleFileLoadError(error, dispatch);
                done();
            });
    },
    type: LOAD_NETWORKED_FILE_IN_VIEWER,
});

const clearOutFileTrajectoryUrlParam = () => {
    const parsed = queryString.parse(location.search);
    if (parsed[URL_PARAM_KEY_FILE_NAME]) {
        const url = new URL(location.href); // no IE support
        history.pushState(null, ""); // save current state so back button works
        url.searchParams.delete(URL_PARAM_KEY_FILE_NAME);
        history.replaceState(null, "", url.href);
    }
};

const loadLocalFile = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const currentState = getState();
        const simulariumController =
            getSimulariumController(currentState) || action.controller;
        const lastSimulariumFile: LocalSimFile =
            getSimulariumFile(currentState);
        const simulariumFile = action.payload;

        if (lastSimulariumFile) {
            if (
                lastSimulariumFile.name === simulariumFile.name &&
                lastSimulariumFile.lastModified === simulariumFile.lastModified
            ) {
                // exact same file loaded again, don't need to reload anything
                return;
            }
        }

        clearOutFileTrajectoryUrlParam();

        simulariumController
            .changeFile(
                {
                    simulariumFile: simulariumFile.data,
                    geoAssets: simulariumFile.geoAssets,
                },
                simulariumFile.name
            )
            .then(() => {
                dispatch(receiveSimulariumFile(simulariumFile));
            })
            .then(() => {
                if (simulariumFile.data.plotData) {
                    dispatch(
                        receiveTrajectory({
                            plotData: simulariumFile.data.plotData.data,
                        })
                    );
                }
            })
            .then(done)
            .catch((error: FrontEndError) => {
                handleFileLoadError(error, dispatch);
                done();
            });
    },
    type: LOAD_LOCAL_FILE_IN_VIEWER,
});

const loadFileViaUrl = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;

        const currentState = getState();
        dispatch(
            setStatus({
                status: VIEWER_LOADING,
            })
        );
        let simulariumController = getSimulariumController(currentState);
        if (!simulariumController) {
            if (action.controller) {
                simulariumController = action.controller;
                dispatch(setSimulariumController(simulariumController));
            }
        }

        const url = getUserTrajectoryUrl(action.payload, action.fileId);
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    // If there's a CORS error, this line of code is not reached because there is no response
                    throw new Error(`Failed to fetch - ${response.status}`);
                }
            })
            .then((blob) => {
                return loadSimulariumFile(blob);
            })
            .then((simulariumFile) => {
                dispatch(
                    changeToLocalSimulariumFile(
                        {
                            name: action.fileId, //TODO: add this to metadata about the file
                            data: simulariumFile,
                            // Temp solution: Set lastModified to a date in the future to tell this apart
                            // from legitimate lastModified values
                            lastModified: Date.now() + 600000, //TODO: add this to metadata about the file
                        },
                        simulariumController
                    )
                );
                done();
            })
            .catch((error) => {
                let errorDetails = `"${url}" failed to load.`;
                // If there was a CORS error, error.message does not contain a status code
                if (error.message === "Failed to fetch") {
                    errorDetails +=
                        "<br/><br/>Try uploading your trajectory file from a Dropbox, Google Drive, or Amazon S3 link instead.";
                }
                batch(() => {
                    dispatch(setStatus({ status: VIEWER_ERROR }));
                    dispatch(
                        setError({
                            level: ErrorLevel.ERROR,
                            message: error.message,
                            htmlData: errorDetails,
                            onClose: () =>
                                history.replaceState(
                                    {},
                                    "",
                                    `${location.origin}${location.pathname}`
                                ),
                        })
                    );
                    dispatch(clearSimulariumFile({ newFile: false }));
                });
                clearBrowserUrlParams();
                done();
            });
    },
    type: LOAD_FILE_VIA_URL,
});

const setTrajectoryStateFromUrlParams = createLogic({
    process(deps: ReduxLogicDeps) {
        const { getState } = deps;
        const currentState = getState();

        const simulariumController = getSimulariumController(currentState);

        const parsed = queryString.parse(location.search);
        const DEFAULT_TIME = 0;

        if (parsed[URL_PARAM_KEY_TIME]) {
            const time = Number(parsed[URL_PARAM_KEY_TIME]);
            simulariumController.gotoTime(time);
        } else {
            // currently this won't be called because URL_PARAM_KEY_TIME
            // is the only param that can get you into this logic
            // but if we are setting camera position, we will want to
            // make sure the time also gets set.
            simulariumController.gotoTime(DEFAULT_TIME);
        }
    },
    type: SET_URL_PARAMS,
});

export default [
    requestPlotDataLogic,
    loadLocalFile,
    loadNetworkedFile,
    resetSimulariumFileState,
    loadFileViaUrl,
    setTrajectoryStateFromUrlParams,
];
