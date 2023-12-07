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
} from "../../constants";
import { clearUrlParams } from "../../util";
import { getUserTrajectoryUrl } from "../../util/userUrlHandling";
import {
    VIEWER_LOADING,
    VIEWER_EMPTY,
    VIEWER_ERROR,
    VIEWER_IMPORTING,
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
    setConversionStatus,
} from "./actions";
import {
    LOAD_LOCAL_FILE_IN_VIEWER,
    LOAD_NETWORKED_FILE_IN_VIEWER,
    REQUEST_PLOT_DATA,
    CLEAR_SIMULARIUM_FILE,
    LOAD_FILE_VIA_URL,
    CONVERT_FILE,
    SET_CONVERSION_ENGINE,
    SET_CONVERSION_TEMPLATE,
    CONFIGURE_FILE_CONVERSION,
    CONVERSION_NO_SERVER,
    CONVERSION_SERVER_LIVE,
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
        clearUrlParams();
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
                clearUrlParams();
                done();
            });
    },
    type: LOAD_FILE_VIA_URL,
});

const configureFileConversionLogic = createLogic({
    process(
        deps: ReduxLogicDeps,
        dispatch: <T extends AnyAction>(action: T) => T,
        done
    ) {
        const { getState } = deps;

        // I imagine this will eventually replace the config up top
        // but for development purposes I'm leaving it here
        // until we switch to Octopus, make sure it matches your local instance.
        const netConnectionConfig: NetConnectionParams = {
            serverIp: "0.0.0.0",
            serverPort: 8765,
            useOctopus: true,
            secureConnection: false,
        };
        // check if a controller exists and has the right configuration
        let controller = getSimulariumController(getState());
        if (!controller || !controller.remoteWebsocketClient) {
            dispatch(
                setConversionStatus({
                    status: CONVERSION_NO_SERVER,
                })
            );
            // configure the controller
            controller = new SimulariumController({
                netConnectionSettings: netConnectionConfig,
            });
            // set it in state
            dispatch(setSimulariumController(controller));
        }
        // now that we have a controller, check the server health
        // originally thought to do this every 15 seconds
        // now thinking we do 5 checks, 3 seconds apart
        // if any come back true we assume we're good for now... this is arbitrary
        // i'd rather a flurry of requests that can be started on page load,
        // that have enough delay to allow controller to get configured in the meanwhile
        // and then we run another check when relevant
        // rather than long 15s-1minute periods of sending checks
        let healthCheckSuccessful = false;
        const healthCheckTimeouts: HealthCheckTimeout = {};
        const attempts = 0;

        const performHealthCheck = (attempts: number) => {
            if (healthCheckSuccessful) {
                return; // Stop if a successful response was already received
            }
            const MAX_ATTEMPTS = 5;
            const requestId: string = uuidv4();

            controller.checkServerHealth(() => {
                // callback/handler for viewer function
                healthCheckSuccessful = true;
                clearTimeout(healthCheckTimeouts[requestId]);
                dispatch(
                    setConversionStatus({
                        status: CONVERSION_SERVER_LIVE,
                    })
                );
                done();
            }, netConnectionConfig);

            const timeoutId = setTimeout(() => {
                if (!healthCheckSuccessful) {
                    // just in case another check just resolved
                    clearTimeout(healthCheckTimeouts[requestId]);
                    if (attempts < MAX_ATTEMPTS) {
                        // Retry the health check with incremented count
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
            }, 3000);

            // store the time out id
            healthCheckTimeouts[requestId] = timeoutId;
        };

        // Start the first health check
        performHealthCheck(attempts);
    },
    type: CONFIGURE_FILE_CONVERSION,
});

const fileConversionLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        dispatch(
            setStatus({
                status: VIEWER_IMPORTING,
            })
        );
        done();
    },
    type: CONVERT_FILE,
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
    fileConversionLogic,
    setConversionEngineLogic,
    configureFileConversionLogic,
];
