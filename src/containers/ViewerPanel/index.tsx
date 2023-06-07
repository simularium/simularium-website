import * as React from "react";
import { ActionCreator, AnyAction } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
    compareTimes,
    ErrorLevel,
} from "@aics/simularium-viewer";
import "@aics/simularium-viewer/style/style.css";
import { TrajectoryFileInfo } from "@aics/simularium-viewer/type-declarations/simularium";
import { TimeData } from "@aics/simularium-viewer/type-declarations/viewport";
import { connect } from "react-redux";
import { Modal } from "antd";
import Bowser from "bowser";

import { State } from "../../state/types";
import selectionStateBranch from "../../state/selection";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    VIEWER_EMPTY,
    VIEWER_SUCCESS,
    VIEWER_ERROR,
} from "../../state/viewer/constants";
import {
    ChangeTimeAction,
    SetVisibleAction,
} from "../../state/selection/types";
import {
    ResetDragOverViewerAction,
    DragOverViewerAction,
    ToggleAction,
    SetViewerStatusAction,
    ViewerError,
    SetErrorAction,
} from "../../state/viewer/types";
import {
    ReceiveAction,
    LocalSimFile,
    TimeUnits,
    SetUrlParamsAction,
} from "../../state/trajectory/types";
import { batchActions } from "../../state/util";
import PlaybackControls from "../../components/PlaybackControls";
import CameraControls from "../../components/CameraControls";
import ScaleBar from "../../components/ScaleBar";
import { TUTORIAL_PATHNAME } from "../../routes";
import ErrorNotification from "../../components/ErrorNotification";

import {
    convertUIDataToSelectionData,
    getDisplayTimes,
    getSelectionStateInfoForViewer,
} from "./selectors";
import { AGENT_COLORS } from "./constants";
import { DisplayTimes } from "./types";

import styles from "./style.css";
import { MOBILE_CUTOFF } from "../../constants";
import { hasUrlParamsSettings } from "../../util";

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
    receiveAgentNamesAndStates: ActionCreator<ReceiveAction>;
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
}

interface ViewerPanelState {
    isInitialPlay: boolean;
    particleTypeIds: string[];
    height: number;
    width: number;
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

        if (window.matchMedia(MOBILE_CUTOFF).matches) {
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

    public onTrajectoryFileInfoChanged(data: TrajectoryFileInfo) {
        const { receiveTrajectory, simulariumController } = this.props;
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

    public receiveTimeChange(timeData: TimeData): any {
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

        if (status !== VIEWER_SUCCESS) {
            actions.push(setStatus({ status: VIEWER_SUCCESS }));
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
        const { receiveAgentNamesAndStates, setAgentsVisible } = this.props;

        const selectedAgents = convertUIDataToSelectionData(uiData);
        const actions = [
            receiveAgentNamesAndStates(uiData),
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
                            setStatus({ status: VIEWER_ERROR });
                        }
                    }}
                    onTrajectoryFileInfoChanged={
                        this.onTrajectoryFileInfoChanged
                    }
                />
                {firstFrameTime !== lastFrameTime && (
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
                        isEmpty={status === VIEWER_EMPTY}
                    />
                )}
                <ScaleBar label={scaleBarLabel} />
                <CameraControls
                    resetCamera={simulariumController.resetCamera}
                    zoomIn={simulariumController.zoomIn}
                    zoomOut={simulariumController.zoomOut}
                    setPanningMode={simulariumController.setPanningMode}
                    setFocusMode={simulariumController.setFocusMode}
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
    };
}

const dispatchToPropsMap = {
    changeTime: selectionStateBranch.actions.changeTime,
    setAgentsVisible: selectionStateBranch.actions.setAgentsVisible,
    receiveTrajectory: trajectoryStateBranch.actions.receiveTrajectory,
    receiveAgentTypeIds: trajectoryStateBranch.actions.receiveAgentTypeIds,
    receiveAgentNamesAndStates:
        trajectoryStateBranch.actions.receiveAgentNamesAndStates,
    setStatus: viewerStateBranch.actions.setStatus,
    dragOverViewer: viewerStateBranch.actions.dragOverViewer,
    resetDragOverViewer: viewerStateBranch.actions.resetDragOverViewer,
    setBuffering: viewerStateBranch.actions.setBuffering,
    setIsPlaying: viewerStateBranch.actions.setIsPlaying,
    setIsLooping: viewerStateBranch.actions.setIsLooping,
    setError: viewerStateBranch.actions.setError,
    setUrlParams: trajectoryStateBranch.actions.setUrlParams,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ViewerPanel);
