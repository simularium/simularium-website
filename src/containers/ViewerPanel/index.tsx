import * as React from "react";
import { ActionCreator, AnyAction } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
    compareTimes,
    ErrorLevel,
    TrajectoryFileInfo,
    TimeData,
} from "@aics/simularium-viewer";
import "@aics/simularium-viewer/style/style.css";
import { AgentData } from "@aics/simularium-viewer/type-declarations/simularium/types";
import { connect } from "react-redux";
import { Modal } from "antd";
import Bowser from "bowser";

import { State } from "../../state/types";
import selectionStateBranch from "../../state/selection";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    ChangeTimeAction,
    SetSelectedAgentMetadataAction,
    SetVisibleAction,
} from "../../state/selection/types";
import {
    ResetDragOverViewerAction,
    DragOverViewerAction,
    ToggleAction,
    SetViewerStatusAction,
    ViewerError,
    SetErrorAction,
    ViewerStatus,
} from "../../state/viewer/types";
import {
    ReceiveAction,
    LocalSimFile,
    TimeUnits,
    ConversionStatus,
    SetConversionStatusAction,
    SetUrlParamsAction,
    SetDefaultUIDataAction,
} from "../../state/trajectory/types";
import { batchActions } from "../../state/util";
import PlaybackControls from "../../components/PlaybackControls";
import RecordMoviesComponent from "../../components/RecordMoviesComponent";
import CameraControls from "../../components/CameraControls";
import ScaleBar from "../../components/ScaleBar";
import { EMBED_PATHNAME, TUTORIAL_PATHNAME } from "../../routes";
import ErrorNotification from "../../components/ErrorNotification";
import { MOBILE_CUTOFF } from "../../constants";
import { hasUrlParamsSettings } from "../../util/userUrlHandling";
import { ConversionProcessingData } from "../../state/trajectory/conversion-data-types";

import {
    convertUIDataToSelectionData,
    getDisplayTimes,
    getSelectionStateInfoForViewer,
    getMovieTitle,
} from "./selectors";
import { AGENT_COLORS } from "./constants";
import { DisplayTimes } from "./types";

import styles from "./style.css";

interface ViewerPanelProps {
    time: number;
    numberPanelsCollapsed: number;
    timeStep: number;
    firstFrameTime: number;
    lastFrameTime: number;
    displayTimes: DisplayTimes;
    timeUnits: TimeUnits;
    isPlaying: boolean;
    isLooping: boolean;
    fileIsDraggedOver: boolean;
    status: string;
    numFrames: number;
    isBuffering: boolean;
    scaleBarLabel: string;
    setUrlParams: ActionCreator<SetUrlParamsAction>;
    simulariumController: SimulariumController;
    changeTime: ActionCreator<ChangeTimeAction>;
    receiveAgentTypeIds: ActionCreator<ReceiveAction>;
    receiveTrajectory: ActionCreator<ReceiveAction>;
    selectionStateInfoForViewer: SelectionStateInfo;
    setIsPlaying: ActionCreator<ToggleAction>;
    setIsLooping: ActionCreator<ToggleAction>;
    loadLocalFile: (localSimFile: LocalSimFile) => void;
    dragOverViewer: ActionCreator<DragOverViewerAction>;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    setStatus: ActionCreator<SetViewerStatusAction>;
    error: ViewerError;
    setBuffering: ActionCreator<ToggleAction>;
    setError: ActionCreator<SetErrorAction>;
    movieTitle: string;
    conversionStatus: ConversionStatus;
    setConversionStatus: ActionCreator<SetConversionStatusAction>;
    receiveConvertedFile: ActionCreator<ReceiveAction>;
    conversionProcessingData: ConversionProcessingData;
    setSelectedAgentMetadata: ActionCreator<SetSelectedAgentMetadataAction>;
    setDefaultUIData: ActionCreator<SetDefaultUIDataAction>;
}

interface ViewerPanelState {
    isInitialPlay: boolean;
    particleTypeIds: string[];
    height: number;
    width: number;
    movieURL: string;
}

class ViewerPanel extends React.Component<ViewerPanelProps, ViewerPanelState> {
    private centerContent = React.createRef<HTMLDivElement>();

    constructor(props: ViewerPanelProps) {
        super(props);
        this.playBackOne = this.playBackOne.bind(this);
        this.playForwardOne = this.playForwardOne.bind(this);
        this.startPlay = this.startPlay.bind(this);
        this.toggleLooping = this.toggleLooping.bind(this);
        this.pause = this.pause.bind(this);
        this.receiveTimeChange = this.receiveTimeChange.bind(this);
        this.handleJsonMeshData = this.handleJsonMeshData.bind(this);
        this.onTrajectoryFileInfoChanged =
            this.onTrajectoryFileInfoChanged.bind(this);
        this.skipToTime = this.skipToTime.bind(this);
        this.resize = this.resize.bind(this);

        this.state = {
            isInitialPlay: true,
            particleTypeIds: [],
            height: 0,
            width: 0,
            movieURL: "",
        };
    }

    public resize(current: HTMLDivElement) {
        const width = current.offsetWidth;
        const height = current.offsetHeight;
        this.setState({ height, width });
    }

    public componentDidMount() {
        const browser = Bowser.getParser(window.navigator.userAgent);
        // Versions from https://caniuse.com/webgl2
        const isBrowserSupported = browser.satisfies({
            firefox: ">=51",
            chrome: ">=56",
            edge: ">=79",
        });
        if (!isBrowserSupported) {
            Modal.info({
                title: "The browser you are using is not supported.",
                content: (
                    <p>
                        Please use Firefox, Chrome, or Edge. See more details{" "}
                        <a href={`${TUTORIAL_PATHNAME}#browser-support`}>
                            here
                        </a>{" "}
                        or choose OK to continue anyway.
                    </p>
                ),
            });
        }
        // disable small screen warning on embed page
        const location = window.location;
        if (
            window.matchMedia(MOBILE_CUTOFF).matches &&
            location.pathname !== EMBED_PATHNAME
        ) {
            Modal.warning({
                title: "Small screens are not supported",
                content:
                    "The Simularium Viewer does not support small screens at this time. Please use a larger screen for the best experience.",
            });
        }

        const current = this.centerContent.current;
        if (current) {
            window.addEventListener("resize", () => this.resize(current));
            setTimeout(() => {
                // wait for panel animation to finish.
                this.resize(current);
            }, 200);
        }
    }

    public componentDidUpdate(prevProps: ViewerPanelProps) {
        const { error } = this.props;
        const current = this.centerContent.current;
        const isNewError = () => {
            if (!prevProps.error && error) {
                return true;
            }
            if (
                prevProps &&
                error &&
                error.message !== prevProps.error.message
            ) {
                return true;
            }
            return false;
        };

        if (isNewError()) {
            return ErrorNotification({ ...error });
        }
        if (
            current &&
            this.props.numberPanelsCollapsed !== prevProps.numberPanelsCollapsed
        ) {
            setTimeout(() => {
                // wait for panel animation to finish.
                this.resize(current);
            }, 200);
        }
    }

    public playForwardOne() {
        const { time, timeStep } = this.props;
        this.skipToTime(time + timeStep);
    }

    public playBackOne() {
        const { time, timeStep } = this.props;
        this.skipToTime(time - timeStep);
    }

    public handleJsonMeshData(jsonData: any) {
        const { receiveAgentTypeIds } = this.props;
        const particleTypeIds = Object.keys(jsonData);
        receiveAgentTypeIds(particleTypeIds);
    }

    // timeOverride is passed in when the user manipulates the playback slider
    // because this.props.time sometimes doesn't get updated in time before mouseUp
    public startPlay(timeOverride?: number) {
        const {
            time,
            timeStep,
            simulariumController,
            firstFrameTime,
            lastFrameTime,
            setBuffering,
            setIsPlaying,
        } = this.props;
        let newTime = timeOverride !== undefined ? timeOverride : time;
        if (newTime + timeStep >= lastFrameTime) {
            newTime = firstFrameTime;
        }
        simulariumController.playFromTime(newTime);
        setBuffering(true);
        setIsPlaying(true);
    }

    public pause() {
        const { setIsPlaying } = this.props;
        setIsPlaying(false);
    }

    public toggleLooping() {
        const { isLooping, setIsLooping } = this.props;
        setIsLooping(!isLooping);
    }

    public handleIncomingConvertedFile(data: TrajectoryFileInfo) {
        const { receiveConvertedFile, conversionProcessingData } = this.props;
        const { fileId } = conversionProcessingData;
        const title = data.trajectoryTitle || fileId;
        receiveConvertedFile({
            name: fileId,
            title: title,
        });
    }

    public onTrajectoryFileInfoChanged(data: TrajectoryFileInfo) {
        const { receiveTrajectory, simulariumController, conversionStatus } =
            this.props;
        if (conversionStatus === ConversionStatus.Active) {
            this.handleIncomingConvertedFile(data);
        }
        const tickIntervalLength = simulariumController.tickIntervalLength;

        let scaleBarLabelNumber =
            tickIntervalLength * data.spatialUnits.magnitude;
        scaleBarLabelNumber = parseFloat(scaleBarLabelNumber.toPrecision(2));
        const scaleBarLabelUnit = data.spatialUnits.name;

        receiveTrajectory({
            numFrames: data.totalSteps,
            timeStep: data.timeStepSize,
            timeUnits: data.timeUnits,
            scaleBarLabel: scaleBarLabelNumber + " " + scaleBarLabelUnit,
        });

        this.setState({
            isInitialPlay: true,
        });
    }

    public receiveTimeChange(timeData: TimeData): void {
        const {
            changeTime,
            setStatus,
            status,
            lastFrameTime,
            numFrames,
            timeStep,
            receiveTrajectory,
            setBuffering,
            isLooping,
            setUrlParams,
        } = this.props;
        if (this.state.isInitialPlay) {
            receiveTrajectory({
                firstFrameTime: timeData.time,
                lastFrameTime: (numFrames - 1) * timeStep + timeData.time,
            });
            if (hasUrlParamsSettings()) {
                // these are settings that need to be applied after the trajectory
                // is loaded but before the user can interact with the trajectory
                setUrlParams();
                this.setState({ isInitialPlay: false });
            }
            this.setState({ isInitialPlay: false });
        }
        const actions: AnyAction[] = [
            changeTime(timeData.time),
            setBuffering(false),
        ];

        if (status !== ViewerStatus.Success) {
            actions.push(setStatus({ status: ViewerStatus.Success }));
        }

        const atLastFrame =
            compareTimes(timeData.time, lastFrameTime, timeStep) === 0;
        if (atLastFrame && isLooping) {
            actions.push(changeTime(0));
            this.startPlay(0);
        } else if (atLastFrame) {
            this.pause();
        }

        batchActions(actions);
    }

    public skipToTime(time: number) {
        const {
            simulariumController,
            firstFrameTime,
            lastFrameTime,
            timeStep,
            isBuffering,
            setBuffering,
        } = this.props;
        if (isBuffering) {
            return;
        }

        const isTimeGreaterThanLastFrameTime =
            compareTimes(time, lastFrameTime, timeStep) === 1;
        const isTimeLessThanFirstFrameTime =
            compareTimes(time, firstFrameTime, timeStep) === -1;
        if (isTimeGreaterThanLastFrameTime || isTimeLessThanFirstFrameTime) {
            return;
        }

        setBuffering(true);
        simulariumController.gotoTime(time);
    }

    public handleUiDisplayDataChanged = (uiData: UIDisplayData) => {
        const { setAgentsVisible, setDefaultUIData } = this.props;

        const selectedAgents = convertUIDataToSelectionData(uiData);
        const actions = [
            setDefaultUIData(uiData),
            setAgentsVisible(selectedAgents),
        ];
        batchActions(actions);
    };

    public handleArrowKeyDown = (event: React.KeyboardEvent) => {
        const { simulariumController } = this.props;
        if (event.key === "ArrowUp") {
            simulariumController.zoomIn();
        } else if (event.key === "ArrowDown") {
            simulariumController.zoomOut();
        }
    };

    public resetAfterMovieRecording = () => {
        if (this.state.movieURL) {
            URL.revokeObjectURL(this.state.movieURL);
        }
        this.setState({
            movieURL: "",
        });
    };

    public onRecordedMovie = (videoBlob: Blob) => {
        const url = URL.createObjectURL(videoBlob);
        this.setState({
            movieURL: url,
        });
    };

    public onSelectedAgentChange = (agentData: AgentData) => {
        if (agentData.instanceId !== -1) {
            this.props.setSelectedAgentMetadata({
                uniqueId: agentData.instanceId,
                agentType: agentData.type,
                position: {
                    x: agentData.x,
                    y: agentData.y,
                    z: agentData.z,
                },
                rotation: {
                    x: agentData.xrot,
                    y: agentData.yrot,
                    z: agentData.zrot,
                },
                radius: agentData.cr,
            });
        } else {
            this.props.setSelectedAgentMetadata({});
        }
    };

    public render(): JSX.Element {
        const {
            time,
            firstFrameTime,
            lastFrameTime,
            simulariumController,
            selectionStateInfoForViewer,
            setStatus,
            timeStep,
            timeUnits,
            displayTimes,
            isBuffering,
            isPlaying,
            isLooping,
            status,
            setError,
            scaleBarLabel,
            movieTitle,
        } = this.props;
        return (
            <div
                ref={this.centerContent}
                className={styles.container}
                onKeyDown={this.handleArrowKeyDown}
            >
                <SimulariumViewer
                    height={this.state.height}
                    width={this.state.width}
                    loggerLevel="off"
                    onTimeChange={this.receiveTimeChange}
                    simulariumController={simulariumController}
                    onJsonDataArrived={this.handleJsonMeshData}
                    onUIDisplayDataChanged={this.handleUiDisplayDataChanged}
                    selectionStateInfo={selectionStateInfoForViewer}
                    showCameraControls={false}
                    agentColors={AGENT_COLORS}
                    loadInitialData={false}
                    onError={(error) => {
                        setError({
                            level: error.level,
                            message: error.message,
                            htmlData: error.htmlData,
                        });
                        if (error.level === ErrorLevel.ERROR) {
                            setStatus({ status: ViewerStatus.Error });
                        }
                    }}
                    onTrajectoryFileInfoChanged={
                        this.onTrajectoryFileInfoChanged
                    }
                    onRecordedMovie={this.onRecordedMovie}
                    onFollowObjectChanged={this.onSelectedAgentChange}
                />
                {firstFrameTime !== lastFrameTime && (
                    <div className={styles.bottomControlsContainer}>
                        <PlaybackControls
                            playHandler={this.startPlay}
                            time={time}
                            timeStep={timeStep}
                            displayTimes={displayTimes}
                            timeUnits={timeUnits}
                            onTimeChange={this.skipToTime}
                            pauseHandler={this.pause}
                            prevHandler={this.playBackOne}
                            nextHandler={this.playForwardOne}
                            isPlaying={isPlaying}
                            isLooping={isLooping}
                            loopHandler={this.toggleLooping}
                            firstFrameTime={firstFrameTime}
                            lastFrameTime={lastFrameTime}
                            loading={isBuffering}
                            isEmpty={status === ViewerStatus.Empty}
                        />
                        <RecordMoviesComponent
                            movieUrl={this.state.movieURL}
                            movieTitle={movieTitle}
                            resetAfterMovieRecording={
                                this.resetAfterMovieRecording
                            }
                            startRecording={simulariumController.startRecording}
                            stopRecording={simulariumController.stopRecording}
                        />
                    </div>
                )}

                <ScaleBar label={scaleBarLabel} />
                <CameraControls
                    resetCamera={simulariumController.resetCamera}
                    zoomIn={simulariumController.zoomIn}
                    zoomOut={simulariumController.zoomOut}
                    setPanningMode={simulariumController.setPanningMode}
                    setFocusMode={simulariumController.setFocusMode}
                    setCameraType={simulariumController.setCameraType}
                />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: selectionStateBranch.selectors.getCurrentTime(state),
        numberPanelsCollapsed:
            selectionStateBranch.selectors.getNumberCollapsed(state),
        firstFrameTime:
            trajectoryStateBranch.selectors.getFirstFrameTimeOfCachedSimulation(
                state
            ),
        lastFrameTime:
            trajectoryStateBranch.selectors.getLastFrameTimeOfCachedSimulation(
                state
            ),
        numFrames: trajectoryStateBranch.selectors.getNumFrames(state),
        timeStep: trajectoryStateBranch.selectors.getTimeStep(state),
        displayTimes: getDisplayTimes(state),
        timeUnits: trajectoryStateBranch.selectors.getTimeUnits(state),
        scaleBarLabel: trajectoryStateBranch.selectors.getScaleBarLabel(state),
        selectionStateInfoForViewer: getSelectionStateInfoForViewer(state),
        status: viewerStateBranch.selectors.getStatus(state),
        error: viewerStateBranch.selectors.getError(state),
        fileIsDraggedOver:
            viewerStateBranch.selectors.getFileDraggedOver(state),
        isBuffering: viewerStateBranch.selectors.getIsBuffering(state),
        isPlaying: viewerStateBranch.selectors.getIsPlaying(state),
        isLooping: viewerStateBranch.selectors.getIsLooping(state),
        movieTitle: getMovieTitle(state),
        conversionStatus:
            trajectoryStateBranch.selectors.getConversionStatus(state),
        conversionProcessingData:
            trajectoryStateBranch.selectors.getConversionProcessingData(state),
    };
}

const dispatchToPropsMap = {
    changeTime: selectionStateBranch.actions.changeTime,
    setAgentsVisible: selectionStateBranch.actions.setAgentsVisible,
    receiveTrajectory: trajectoryStateBranch.actions.receiveTrajectory,
    receiveAgentTypeIds: trajectoryStateBranch.actions.receiveAgentTypeIds,
    setStatus: viewerStateBranch.actions.setStatus,
    dragOverViewer: viewerStateBranch.actions.dragOverViewer,
    resetDragOverViewer: viewerStateBranch.actions.resetDragOverViewer,
    setBuffering: viewerStateBranch.actions.setBuffering,
    setIsPlaying: viewerStateBranch.actions.setIsPlaying,
    setIsLooping: viewerStateBranch.actions.setIsLooping,
    setError: viewerStateBranch.actions.setError,
    receiveConvertedFile: trajectoryStateBranch.actions.receiveConvertedFile,
    setConversionStatus: trajectoryStateBranch.actions.setConversionStatus,
    setUrlParams: trajectoryStateBranch.actions.setUrlParams,
    setSelectedAgentMetadata:
        selectionStateBranch.actions.setSelectedAgentMetadata,
    setDefaultUIData: trajectoryStateBranch.actions.setDefaultUIData,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ViewerPanel);
