import * as React from "react";
import { ActionCreator } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
} from "@aics/simularium-viewer";
import "@aics/simularium-viewer/style/style.css";
import { connect } from "react-redux";

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
} from "../../state/metadata/types";
import PlaybackControls from "../../components/PlaybackControls";

import {
    convertUIDataToColorMap,
    convertUIDataToSelectionData,
    getSelectionStateInfoForViewer,
} from "./selectors";
import { AGENT_COLORS } from "./constants";

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
        const current = this.centerContent.current;
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
        console.log("GOT JSON");
        const { receiveAgentTypeIds } = this.props;
        const particleTypeIds = Object.keys(jsonData);
        receiveAgentTypeIds(particleTypeIds);
    }

    public highlightParticleType(typeId: number) {
        const highlightId = typeId;
        this.setState({ highlightId });
    }

    public startPlay() {
        const { time, timeStep, simulariumController } = this.props;
        simulariumController.playFromTime(time + timeStep);
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
            totalTime: data.totalDuration,
            timeStepSize: data.timeStepSize,
        });
    }

    public receiveTimeChange(timeData: any) {
        const { changeTime } = this.props;
        this.setState({ requestingTimeChange: false });

        changeTime(timeData.time);
    }

    public skipToTime(time: number) {
        if (this.state.requestingTimeChange) {
            return;
        }
        console.log(time);
        const { simulariumController } = this.props;
        this.setState({ requestingTimeChange: true });
        simulariumController.gotoTime(time);
    }

    public handleUiDisplayDataChanged = (uiData: UIDisplayData) => {
        const {
            receiveAgentNamesAndStates,
            setAgentsVisible,
            setAllAgentColors,
            setViewerStatus,
            viewerStatus,
        } = this.props;
        if (viewerStatus !== VIEWER_SUCCESS) {
            setViewerStatus(VIEWER_SUCCESS);
        }
        const selectedAgents = convertUIDataToSelectionData(uiData);
        const agentColors = convertUIDataToColorMap(uiData);
        receiveAgentNamesAndStates(uiData);
        setAllAgentColors(agentColors);
        setAgentsVisible(selectedAgents);
    };

    public render(): JSX.Element {
        const {
            time,
            totalTime,
            simulariumController,
            selectionStateInfoForViewer,
        } = this.props;
        return (
            <div ref={this.centerContent} className={styles.container}>
                <SimulariumViewer
                    height={this.state.height}
                    width={this.state.width}
                    loggerLevel="off"
                    onTimeChange={this.receiveTimeChange}
                    simulariumController={simulariumController}
                    onJsonDataArrived={this.handleJsonMeshData}
                    onUIDisplayDataChanged={this.handleUiDisplayDataChanged}
                    selectionStateInfo={selectionStateInfoForViewer}
                    agentColors={AGENT_COLORS}
                    onTrajectoryFileInfoChanged={
                        this.onTrajectoryFileInfoChanged
                    }
                />
                <PlaybackControls
                    playHandler={this.startPlay}
                    time={time}
                    onTimeChange={this.skipToTime}
                    pauseHandler={this.pause}
                    prevHandler={this.playBackOne}
                    nextHandler={this.playForwardOne}
                    isPlaying={this.state.isPlaying}
                    totalTime={totalTime}
                    loading={this.state.requestingTimeChange}
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
    dragOverViewer: selectionStateBranch.actions.dragOverViewer,
    resetDragOverViewer: selectionStateBranch.actions.resetDragOverViewer,
    setViewerStatus: metadataStateBranch.actions.setViewerStatus,
    setAllAgentColors: selectionStateBranch.actions.setAllAgentColors,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
