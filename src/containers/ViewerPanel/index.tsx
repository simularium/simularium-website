import * as React from "react";
import { ActionCreator, AnyAction } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
} from "@aics/simularium-viewer";
import "@aics/simularium-viewer/style/style.css";
import { connect } from "react-redux";
import { notification } from "antd";

import { State } from "../../state/types";
import selectionStateBranch from "../../state/selection";
import metadataStateBranch from "../../state/metadata";
import { VIEWER_SUCCESS } from "../../state/metadata/constants";
import {
    ChangeTimeAction,
    ResetDragOverViewerAction,
    DragOverViewerAction,
    SetVisibleAction,
    SetAllColorsAction,
} from "../../state/selection/types";
import {
    ReceiveAction,
    LocalSimFile,
    SetViewerStatusAction,
    ViewerError,
} from "../../state/metadata/types";
import PlaybackControls from "../../components/PlaybackControls";
import { VIEWER_ERROR } from "../../state/metadata/constants";
import { convertToSentenceCase } from "../../util";

import {
    convertUIDataToColorMap,
    convertUIDataToSelectionData,
    getSelectionStateInfoForViewer,
} from "./selectors";
import { AGENT_COLORS } from "./constants";
import { batchActions } from "../../state/util";
import CameraControls from "../../components/CameraControls";

const styles = require("./style.css");

interface ViewerPanelProps {
    simulariumController: SimulariumController;
    time: number;
    numberPanelsCollapsed: number;
    changeTime: ActionCreator<ChangeTimeAction>;
    timeStep: number;
    receiveAgentTypeIds: ActionCreator<ReceiveAction>;
    totalTime: number;
    receiveMetadata: ActionCreator<ReceiveAction>;
    receiveAgentNamesAndStates: ActionCreator<ReceiveAction>;
    selectionStateInfoForViewer: SelectionStateInfo;
    loadLocalFile: (localSimFile: LocalSimFile) => void;
    fileIsDraggedOverViewer: boolean;
    dragOverViewer: ActionCreator<DragOverViewerAction>;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    viewerStatus: string;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setAllAgentColors: ActionCreator<SetAllColorsAction>;
    viewerError: ViewerError;
}

interface ViewerPanelState {
    isPlaying: boolean;
    isInitialPlay: boolean;
    highlightId: number;
    particleTypeIds: string[];
    height: number;
    width: number;
    requestingTimeChange: boolean;
}

class ViewerPanel extends React.Component<ViewerPanelProps, ViewerPanelState> {
    private animationTimer: number | null;
    private centerContent = React.createRef<HTMLDivElement>();

    constructor(props: ViewerPanelProps) {
        super(props);
        this.animationTimer = null;
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
            isPlaying: false,
            isInitialPlay: true,
            highlightId: -1,
            particleTypeIds: [],
            height: 0,
            width: 0,
            requestingTimeChange: false,
        };
    }

    public resize(current: HTMLDivElement) {
        const width = current.offsetWidth;
        const height = current.offsetHeight;
        this.setState({ height, width });
    }

    public componentDidMount() {
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
        const { viewerStatus, viewerError } = this.props;
        const current = this.centerContent.current;
        if (
            viewerStatus === VIEWER_ERROR &&
            prevProps.viewerStatus !== VIEWER_ERROR &&
            viewerError.message
        ) {
            notification.error({
                message: convertToSentenceCase(viewerError.message),
                description:
                    (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: viewerError.htmlData as string,
                            }}
                        />
                    ) || "",
                duration: viewerError.htmlData ? 0 : 4.5,
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
        const { time, timeStep, simulariumController } = this.props;
        simulariumController.gotoTime(time + timeStep);
    }

    public playBackOne() {
        const { time, timeStep, simulariumController } = this.props;
        simulariumController.gotoTime(time - timeStep);
    }

    public handleJsonMeshData(jsonData: any) {
        const { receiveAgentTypeIds } = this.props;
        const particleTypeIds = Object.keys(jsonData);
        receiveAgentTypeIds(particleTypeIds);
    }

    public highlightParticleType(typeId: number) {
        const highlightId = typeId;
        this.setState({ highlightId });
    }

    public startPlay() {
        const { time, timeStep, simulariumController, totalTime } = this.props;
        let newTime = time + timeStep;
        if (newTime >= totalTime) {
            newTime = 0;
        }
        simulariumController.playFromTime(newTime);
        simulariumController.resume();
        this.setState({ isPlaying: true });
    }

    public pause() {
        const { simulariumController } = this.props;
        simulariumController.pause();
        this.setState({ isPlaying: false });
    }

    public onTrajectoryFileInfoChanged(data: any) {
        const { receiveMetadata } = this.props;
        receiveMetadata({
            totalTime: data.totalSteps * data.timeStepSize,
            timeStepSize: data.timeStepSize,
        });
    }

    public receiveTimeChange(timeData: any) {
        const {
            changeTime,
            setViewerStatus,
            viewerStatus,
            totalTime,
            timeStep,
        } = this.props;
        this.setState({ requestingTimeChange: false });
        const actions: AnyAction[] = [changeTime(timeData.time)];

        if (viewerStatus !== VIEWER_SUCCESS) {
            actions.push(setViewerStatus({ status: VIEWER_SUCCESS }));
        }
        if (timeData.time + timeStep >= totalTime) {
            this.pause();
        }
        batchActions(actions);
    }

    public skipToTime(time: number) {
        const { simulariumController, totalTime } = this.props;
        if (this.state.requestingTimeChange) {
            return;
        }
        if (time >= totalTime) {
            return;
        }

        this.setState({ requestingTimeChange: true });
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
            totalTime,
            simulariumController,
            selectionStateInfoForViewer,
            setViewerStatus,
            timeStep,
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
                    onTimeChange={this.skipToTime}
                    pauseHandler={this.pause}
                    prevHandler={this.playBackOne}
                    nextHandler={this.playForwardOne}
                    isPlaying={this.state.isPlaying}
                    totalTime={totalTime}
                    loading={this.state.requestingTimeChange}
                />
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
        totalTime: metadataStateBranch.selectors.getTotalTimeOfCachedSimulation(
            state
        ),
        timeStep: metadataStateBranch.selectors.getTimeStepSize(state),
        selectionStateInfoForViewer: getSelectionStateInfoForViewer(state),
        viewerStatus: metadataStateBranch.selectors.getViewerStatus(state),
        viewerError: metadataStateBranch.selectors.getViewerError(state),
        fileIsDraggedOverViewer: selectionStateBranch.selectors.getFileDraggedOverViewer(
            state
        ),
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
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
