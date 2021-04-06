import * as React from "react";
import { ActionCreator, AnyAction } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
} from "@aics/simularium-viewer";
import "@aics/simularium-viewer/style/style.css";
import {
    TrajectoryFileInfo,
    TrajectoryFileInfoV2,
} from "@aics/simularium-viewer/type-declarations/simularium";
import { TimeData } from "@aics/simularium-viewer/type-declarations/viewport";
import { connect } from "react-redux";
import { Modal } from "antd";
import Bowser from "bowser";

import { State } from "../../state/types";
import selectionStateBranch from "../../state/selection";
import metadataStateBranch from "../../state/metadata";
import { VIEWER_EMPTY, VIEWER_SUCCESS } from "../../state/metadata/constants";
import {
    ChangeTimeAction,
    ResetDragOverViewerAction,
    DragOverViewerAction,
    SetVisibleAction,
    SetAllColorsAction,
    ToggleAction,
} from "../../state/selection/types";
import {
    ReceiveAction,
    LocalSimFile,
    SetViewerStatusAction,
    ViewerError,
    TimeUnits,
} from "../../state/metadata/types";
import { VIEWER_ERROR } from "../../state/metadata/constants";
import { batchActions } from "../../state/util";
import PlaybackControls from "../../components/PlaybackControls";
import CameraControls from "../../components/CameraControls";
import ScaleBar from "../../components/ScaleBar";
import { TUTORIAL_PATHNAME } from "../../routes";

import {
    convertUIDataToColorMap,
    convertUIDataToSelectionData,
    getSelectionStateInfoForViewer,
} from "./selectors";
import { AGENT_COLORS } from "./constants";
import errorNotification from "../../components/ErrorNotification";

const styles = require("./style.css");

interface ViewerPanelProps {
    time: number;
    numberPanelsCollapsed: number;
    timeStep: number;
    firstFrameTime: number;
    lastFrameTime: number;
    timeUnits: TimeUnits;
    isPlaying: boolean;
    fileIsDraggedOverViewer: boolean;
    viewerStatus: string;
    numFrames: number;
    isBuffering: boolean;
    simulariumController: SimulariumController;
    changeTime: ActionCreator<ChangeTimeAction>;
    receiveAgentTypeIds: ActionCreator<ReceiveAction>;
    receiveMetadata: ActionCreator<ReceiveAction>;
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
        const { receiveMetadata, simulariumController } = this.props;
        const updatedData = data as TrajectoryFileInfoV2;
        const tickIntervalLength = simulariumController.tickIntervalLength;

        const scaleBarLabelNumber =
            tickIntervalLength * updatedData.spatialUnits.magnitude;
        const scaleBarLabelUnit = updatedData.spatialUnits.name;

        receiveMetadata({
            numFrames: updatedData.totalSteps,
            timeStepSize:
                updatedData.timeStepSize * updatedData.timeUnits.magnitude,
            timeUnits: updatedData.timeUnits,
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
            receiveMetadata,
            setBuffering,
        } = this.props;

        if (this.state.isInitialPlay) {
            receiveMetadata({
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
        if (timeData.time + timeStep > lastFrameTime) {
            this.pause();
        }
        batchActions(actions);
    }

    public skipToTime(time: number) {
        const {
            simulariumController,
            lastFrameTime,
            isBuffering,
            setBuffering,
        } = this.props;
        if (isBuffering) {
            return;
        }
        if (time >= lastFrameTime) {
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
        firstFrameTime: metadataStateBranch.selectors.getFirstFrameTimeOfCachedSimulation(
            state
        ),
        lastFrameTime: metadataStateBranch.selectors.getLastFrameTimeOfCachedSimulation(
            state
        ),
        numFrames: metadataStateBranch.selectors.getNumFrames(state),
        timeStep: metadataStateBranch.selectors.getTimeStepSize(state),
        timeUnits: metadataStateBranch.selectors.getTimeUnits(state),
        selectionStateInfoForViewer: getSelectionStateInfoForViewer(state),
        viewerStatus: metadataStateBranch.selectors.getViewerStatus(state),
        viewerError: metadataStateBranch.selectors.getViewerError(state),
        fileIsDraggedOverViewer: selectionStateBranch.selectors.getFileDraggedOverViewer(
            state
        ),
        isBuffering: selectionStateBranch.selectors.getIsBuffering(state),
        isPlaying: selectionStateBranch.selectors.getIsPlaying(state),
    };
}

const dispatchToPropsMap = {
    changeTime: selectionStateBranch.actions.changeTime,
    receiveMetadata: metadataStateBranch.actions.receiveMetadata,
    receiveAgentTypeIds: metadataStateBranch.actions.receiveAgentTypeIds,
    receiveAgentNamesAndStates:
        metadataStateBranch.actions.receiveAgentNamesAndStates,
    setAgentsVisible: selectionStateBranch.actions.setAgentsVisible,
    setViewerStatus: metadataStateBranch.actions.setViewerStatus,
    dragOverViewer: selectionStateBranch.actions.dragOverViewer,
    resetDragOverViewer: selectionStateBranch.actions.resetDragOverViewer,
    setAllAgentColors: selectionStateBranch.actions.setAllAgentColors,
    setBuffering: selectionStateBranch.actions.setBuffering,
    setIsPlaying: selectionStateBranch.actions.setIsPlaying,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
