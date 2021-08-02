import * as React from "react";
import { ActionCreator, AnyAction } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
    compareTimes,
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
    SetAllColorsAction,
} from "../../state/selection/types";
import {
    ResetDragOverViewerAction,
    DragOverViewerAction,
    ToggleAction,
    SetViewerStatusAction,
    ViewerError,
} from "../../state/viewer/types";
import {
    ReceiveAction,
    LocalSimFile,
    TimeUnits,
} from "../../state/trajectory/types";
import { batchActions } from "../../state/util";
import PlaybackControls from "../../components/PlaybackControls";
import CameraControls from "../../components/CameraControls";
import ScaleBar from "../../components/ScaleBar";
import { TUTORIAL_PATHNAME } from "../../routes";
import errorNotification from "../../components/ErrorNotification";

import {
    convertUIDataToColorMap,
    convertUIDataToSelectionData,
    getDisplayTimes,
    getSelectionStateInfoForViewer,
} from "./selectors";
import { AGENT_COLORS } from "./constants";
import { DisplayTimes } from "./types";

const styles = require("./style.css");

interface ViewerPanelProps {
    time: number;
    numberPanelsCollapsed: number;
    timeStep: number;
    firstFrameTime: number;
    lastFrameTime: number;
    displayTimes: DisplayTimes;
    timeUnits: TimeUnits;
    isPlaying: boolean;
    fileIsDraggedOverViewer: boolean;
    viewerStatus: string;
    numFrames: number;
    isBuffering: boolean;
    simulariumController: SimulariumController;
    changeTime: ActionCreator<ChangeTimeAction>;
    receiveAgentTypeIds: ActionCreator<ReceiveAction>;
    receiveTrajectory: ActionCreator<ReceiveAction>;
    receiveAgentNamesAndStates: ActionCreator<ReceiveAction>;
    selectionStateInfoForViewer: SelectionStateInfo;
    setIsPlaying: ActionCreator<ToggleAction>;
    loadLocalFile: (localSimFile: LocalSimFile) => void;
    dragOverViewer: ActionCreator<DragOverViewerAction>;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setAllAgentColors: ActionCreator<SetAllColorsAction>;
    viewerError: ViewerError;
    setBuffering: ActionCreator<ToggleAction>;
}

interface ViewerPanelState {
    isInitialPlay: boolean;
    particleTypeIds: string[];
    height: number;
    width: number;
    scaleBarLabel: string;
}

class ViewerPanel extends React.Component<ViewerPanelProps, ViewerPanelState> {
    private centerContent = React.createRef<HTMLDivElement>();

    constructor(props: ViewerPanelProps) {
        super(props);
        this.playBackOne = this.playBackOne.bind(this);
        this.playForwardOne = this.playForwardOne.bind(this);
        this.startPlay = this.startPlay.bind(this);
        this.pause = this.pause.bind(this);
        this.receiveTimeChange = this.receiveTimeChange.bind(this);
        this.handleJsonMeshData = this.handleJsonMeshData.bind(this);
        this.onTrajectoryFileInfoChanged = this.onTrajectoryFileInfoChanged.bind(
            this
        );
        this.skipToTime = this.skipToTime.bind(this);
        this.resize = this.resize.bind(this);
        this.state = {
            isInitialPlay: true,
            particleTypeIds: [],
            height: 0,
            width: 0,
            scaleBarLabel: "",
        };
    }

    public resize(current: HTMLDivElement) {
        const width = current.offsetWidth;
        const height = current.offsetHeight;
        this.setState({ height, width });
    }

    public componentDidMount() {
        const { viewerError } = this.props;
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

        if (window.matchMedia("(max-width: 900px)").matches) {
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

        if (viewerError) {
            return errorNotification({
                message: viewerError.message,
                htmlData: viewerError.htmlData,
                onClose: viewerError.onClose,
            });
        }
    }

    public componentDidUpdate(prevProps: ViewerPanelProps) {
        const { viewerStatus, viewerError } = this.props;
        const current = this.centerContent.current;
        if (
            viewerStatus === VIEWER_ERROR &&
            prevProps.viewerStatus !== VIEWER_ERROR &&
            viewerError.message
        ) {
            return errorNotification({
                message: viewerError.message,
                htmlData: viewerError.htmlData,
                onClose: viewerError.onClose,
            });
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
        });

        this.setState({
            scaleBarLabel: scaleBarLabelNumber + " " + scaleBarLabelUnit,
            isInitialPlay: true,
        });
    }

    public receiveTimeChange(timeData: TimeData) {
        const {
            changeTime,
            setViewerStatus,
            viewerStatus,
            lastFrameTime,
            numFrames,
            timeStep,
            receiveTrajectory,
            setBuffering,
        } = this.props;

        if (this.state.isInitialPlay) {
            receiveTrajectory({
                firstFrameTime: timeData.time,
                lastFrameTime: (numFrames - 1) * timeStep + timeData.time,
            });
            this.setState({ isInitialPlay: false });
        }

        const actions: AnyAction[] = [
            changeTime(timeData.time),
            setBuffering(false),
        ];

        if (viewerStatus !== VIEWER_SUCCESS) {
            actions.push(setViewerStatus({ status: VIEWER_SUCCESS }));
        }

        const atLastFrame =
            compareTimes(timeData.time, lastFrameTime, timeStep) === 0;
        if (atLastFrame) {
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
        const {
            receiveAgentNamesAndStates,
            setAgentsVisible,
            setAllAgentColors,
        } = this.props;

        const selectedAgents = convertUIDataToSelectionData(uiData);
        const agentColors = convertUIDataToColorMap(uiData);
        const actions = [
            receiveAgentNamesAndStates(uiData),
            setAllAgentColors(agentColors),
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
            setViewerStatus,
            timeStep,
            timeUnits,
            displayTimes,
            isBuffering,
            isPlaying,
            viewerStatus,
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
                        setViewerStatus({
                            status: VIEWER_ERROR,
                            errorMessage: error,
                        });
                    }}
                    onTrajectoryFileInfoChanged={
                        this.onTrajectoryFileInfoChanged
                    }
                />
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
                    firstFrameTime={firstFrameTime}
                    lastFrameTime={lastFrameTime}
                    loading={isBuffering}
                    isEmpty={viewerStatus === VIEWER_EMPTY}
                />
                <ScaleBar label={this.state.scaleBarLabel} />
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
        numberPanelsCollapsed: selectionStateBranch.selectors.getNumberCollapsed(
            state
        ),
        firstFrameTime: trajectoryStateBranch.selectors.getFirstFrameTimeOfCachedSimulation(
            state
        ),
        lastFrameTime: trajectoryStateBranch.selectors.getLastFrameTimeOfCachedSimulation(
            state
        ),
        numFrames: trajectoryStateBranch.selectors.getNumFrames(state),
        timeStep: trajectoryStateBranch.selectors.getTimeStep(state),
        displayTimes: getDisplayTimes(state),
        timeUnits: trajectoryStateBranch.selectors.getTimeUnits(state),
        selectionStateInfoForViewer: getSelectionStateInfoForViewer(state),
        viewerStatus: viewerStateBranch.selectors.getViewerStatus(state),
        viewerError: viewerStateBranch.selectors.getViewerError(state),
        fileIsDraggedOverViewer: viewerStateBranch.selectors.getFileDraggedOverViewer(
            state
        ),
        isBuffering: viewerStateBranch.selectors.getIsBuffering(state),
        isPlaying: viewerStateBranch.selectors.getIsPlaying(state),
    };
}

const dispatchToPropsMap = {
    changeTime: selectionStateBranch.actions.changeTime,
    setAgentsVisible: selectionStateBranch.actions.setAgentsVisible,
    setAllAgentColors: selectionStateBranch.actions.setAllAgentColors,
    receiveTrajectory: trajectoryStateBranch.actions.receiveTrajectory,
    receiveAgentTypeIds: trajectoryStateBranch.actions.receiveAgentTypeIds,
    receiveAgentNamesAndStates:
        trajectoryStateBranch.actions.receiveAgentNamesAndStates,
    setViewerStatus: viewerStateBranch.actions.setViewerStatus,
    dragOverViewer: viewerStateBranch.actions.dragOverViewer,
    resetDragOverViewer: viewerStateBranch.actions.resetDragOverViewer,
    setBuffering: viewerStateBranch.actions.setBuffering,
    setIsPlaying: viewerStateBranch.actions.setIsPlaying,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
