import * as React from "react";
import { ActionCreator } from "redux";
import SimulariumViewer, {
    SimulariumController,
    UIDisplayData,
    SelectionStateInfo,
} from "@aics/simularium-viewer";
import { connect } from "react-redux";

import {
    getCurrentTime,
    getNumberCollapsed,
} from "../../state/selection/selectors";
import { State } from "../../state/types";
import {
    changeTime,
    turnAgentsOnByDisplayKey,
} from "../../state/selection/actions";
import PlaybackControls from "../../components/PlaybackControls";
import { receiveMetadata } from "../../state/metadata/actions";
import {
    getTotalTimeOfCachedSimulation,
    getTimeStepSize,
} from "../../state/metadata/selectors";
import {
    ChangeTimeAction,
    ChangeAgentsRenderingStateAction,
} from "../../state/selection/types";
import {
    receiveAgentTypeIds,
    receiveAgentNamesAndStates,
} from "../../state/metadata/actions";
import { ReceiveAction } from "../../state/metadata/types";

import "@aics/simularium-viewer/style/style.css";
import { getSelectionStateInfoForViewer } from "./selectors";

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
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
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
        const { simulariumController } = this.props;
        this.setState({ requestingTimeChange: true });
        simulariumController.gotoTime(time);
    }

    public handleUiDisplayDataChanged = (uiData: UIDisplayData) => {
        const {
            receiveAgentNamesAndStates,
            turnAgentsOnByDisplayKey,
        } = this.props;
        receiveAgentNamesAndStates(uiData);
        console.log(uiData);
        const names = uiData.map((agent) => agent.name);
        console.log(names);
        turnAgentsOnByDisplayKey(names);
    };

    public render(): JSX.Element {
        const {
            time,
            totalTime,
            simulariumController,
            selectionStateInfoForViewer,
        } = this.props;
        console.log(selectionStateInfoForViewer);
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
                />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: getCurrentTime(state),
        numberPanelsCollapsed: getNumberCollapsed(state),
        totalTime: getTotalTimeOfCachedSimulation(state),
        timeStep: getTimeStepSize(state),
        selectionStateInfoForViewer: getSelectionStateInfoForViewer(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
    receiveMetadata,
    receiveAgentTypeIds,
    receiveAgentNamesAndStates,
    turnAgentsOnByDisplayKey,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
