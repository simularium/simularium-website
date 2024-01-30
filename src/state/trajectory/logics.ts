import { AxiosResponse } from "axios";
import { batch } from "react-redux";
import { AnyAction } from "redux";
import { createLogic } from "redux-logic";
import { ArgumentAction } from "redux-logic/definitions/action";
import queryString from "query-string";
import { map, reduce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
    ErrorLevel,
    FrontEndError,
    NetConnectionParams,
    SimulariumController,
    loadSimulariumFile,
} from "@aics/simularium-viewer";

import {
    ENGINE_TO_TEMPLATE_MAP,
    URL_PARAM_KEY_FILE_NAME,
    URL_PARAM_KEY_TIME,
} from "../../constants";
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

import { getConversionStatus, getSimulariumFile } from "./selectors";
import {
    changeToLocalSimulariumFile,
    receiveTrajectory,
    receiveSimulariumFile,
    requestCachedPlotData,
    clearSimulariumFile,
    setConversionStatus,
} from "./actions";
import {
    LOAD_LOCAL_FILE_IN_VIEWER,
    LOAD_NETWORKED_FILE_IN_VIEWER,
    REQUEST_PLOT_DATA,
    CLEAR_SIMULARIUM_FILE,
    LOAD_FILE_VIA_URL,
    SET_URL_PARAMS,
    INITIALIZE_CONVERSION,
    SET_CONVERSION_ENGINE,
    SET_CONVERSION_TEMPLATE,
    CONVERSION_NO_SERVER,
    CONVERSION_SERVER_LIVE,
    CONVERSION_INACTIVE,
} from "./constants";
import { ReceiveAction, LocalSimFile, HealthCheckTimeout } from "./types";
import { initialState } from "./reducer";
import {
    TemplateMap,
    CustomTypeDownload,
    BaseType,
    AvailableEngines,
    Template,
} from "./conversion-data-types";

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

// configures the controller for file conversion and sends server health checks
const initializeFileConversionLogic = createLogic({
    process(
        deps: ReduxLogicDeps,
        dispatch: <T extends AnyAction>(action: T) => T,
        done
    ) {
        const { getState } = deps;

        // TODO: Most likely this will eventually replace the config up top
        // but for development purposes it's here
        // until we switch to Octopus, make sure it matches your local instance.
        const netConnectionConfig: NetConnectionParams = {
            serverIp: "0.0.0.0",
            serverPort: 8765,
            useOctopus: true,
            secureConnection: false,
        };
        // check if a controller exists and has the right configuration
        // create/configure as needed and put in state
        let controller = getSimulariumController(getState());
        if (!controller) {
            controller = new SimulariumController({
                netConnectionSettings: netConnectionConfig,
            });
            dispatch(setSimulariumController(controller));
        } else if (!controller.remoteWebsocketClient) {
            controller.configureNetwork(netConnectionConfig);
        }
        // check the server health
        // Currently sending 5 checks, 3 seconds apart, can be adjusted/triggered as needed
        // If any come back true we assume we're good for now, this timing is arbitrary
        let healthCheckSuccessful = false;
        const healthCheckTimeouts: HealthCheckTimeout = {};
        const attempts = 0;

        // recursive function that sends response handlers to viewer with request and timeout ids
        const performHealthCheck = (attempts: number) => {
            if (healthCheckSuccessful) {
                return; // Stop if a successful response was already received
            }
            const MAX_ATTEMPTS = 5;
            const requestId: string = uuidv4();

            controller.checkServerHealth(() => {
                // callback/handler for viewer function
                // only handle if we're still on the conversion page
                if (getConversionStatus(getState()) !== CONVERSION_INACTIVE) {
                    healthCheckSuccessful = true;
                    clearTimeout(healthCheckTimeouts[requestId]);
                    dispatch(
                        setConversionStatus({
                            status: CONVERSION_SERVER_LIVE,
                        })
                    );
                    done();
                }
            }, netConnectionConfig);

            // timeouts that, if they resolve, send new checks until the max # of attempts is reached
            const timeoutId = setTimeout(() => {
                if (!healthCheckSuccessful) {
                    // in case another check just resolved
                    clearTimeout(healthCheckTimeouts[requestId]);
                    // stop process if user has navigated away from conversion page
                    if (
                        getConversionStatus(getState()) !== CONVERSION_INACTIVE
                    ) {
                        if (attempts < MAX_ATTEMPTS) {
                            // retry the health check with incremented count
                            attempts++;
                            performHealthCheck(attempts);
                        } else {
                            // if we've done the max # of attempts, set conversionStatus
                            dispatch(
                                setConversionStatus({
                                    status: CONVERSION_NO_SERVER,
                                })
                            );
                            done();
                        }
                    }
                }
            }, 3000);

            // store the time out id
            healthCheckTimeouts[requestId] = timeoutId;
        };

        // Start the first health check
        performHealthCheck(attempts);
        // restore network settings to default so that things work
        // when we navigate away from conversion page
        // TODO: this will not be relevant once we switch to Octopus
        controller.configureNetwork(netConnectionSettings);
    },
    type: INITIALIZE_CONVERSION,
});

const setConversionEngineLogic = createLogic({
    async process(deps: ReduxLogicDeps): Promise<{
        engineType: AvailableEngines;
        template: Template;
        templateMap: TemplateMap;
    }> {
        const {
            httpClient,
            action,
            uiTemplateUrlRoot,
            uiBaseTypes,
            uiCustomTypes,
            uiTemplateDownloadUrlRoot,
        } = deps;
        const baseTypes = await httpClient
            .get(`${uiTemplateDownloadUrlRoot}/${uiBaseTypes}`)
            .then((baseTypesReturn: AxiosResponse) => {
                return baseTypesReturn.data;
            });

        const customTypes = await httpClient
            .get(`${uiTemplateUrlRoot}/${uiCustomTypes}`)
            .then((customTypesReturn: AxiosResponse) => {
                return customTypesReturn.data;
            })
            .then((fileRefs) =>
                Promise.all(
                    map(
                        fileRefs,
                        async (ref) =>
                            await httpClient
                                .get(ref.download_url)
                                .then((file) => file.data)
                    )
                )
            );

        const initTypeMap: TemplateMap = {};

        const typeMap: TemplateMap = reduce(
            customTypes,
            (acc, cur: CustomTypeDownload) => {
                //CustomType always has just one
                const key = Object.keys(cur)[0] as string;
                acc[key] = cur[key];
                return acc;
            },
            initTypeMap
        );
        baseTypes["base_types"].forEach((type: BaseType) => {
            typeMap[type.id] = { ...type, isBaseType: true };
        });
        const templateName =
            ENGINE_TO_TEMPLATE_MAP[action.payload as AvailableEngines];
        const engineTemplate = await httpClient
            .get(`${uiTemplateDownloadUrlRoot}/${templateName}.json`)
            .then((engineTemplateReturn) => engineTemplateReturn.data);
        return {
            engineType: action.payload,
            template: engineTemplate[templateName],
            templateMap: typeMap,
        };
    },
    processOptions: {
        dispatchReturn: true,
        successType: SET_CONVERSION_TEMPLATE,
    },
    type: SET_CONVERSION_ENGINE,
});

export default [
    requestPlotDataLogic,
    loadLocalFile,
    loadNetworkedFile,
    resetSimulariumFileState,
    loadFileViaUrl,
    setTrajectoryStateFromUrlParams,
    setConversionEngineLogic,
    initializeFileConversionLogic,
];
