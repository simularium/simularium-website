import * as React from "react";
import { ActionCreator } from "redux";
import { AgentSimController } from "agentviz-viewer";
import { connect } from "react-redux";

import ThreeDViewer from "../../components/Viewer";
import {
    getCurrentTime,
    getNumberCollapsed,
    getHightlightedId,
} from "../../state/selection/selectors";
import { State } from "../../state/types";
import { changeTime, turnAgentsOn } from "../../state/selection/actions";
import PlaybackControls from "../../components/PlaybackControls";
import { receiveMetadata } from "../../state/metadata/actions";
import {
    getTotalTimeOfCachedSimulation,
    getTimeStepSize,
} from "../../state/metadata/selectors";
import { ENGINE_METHOD_DIGESTS } from "constants";
import {
    ChangeTimeAction,
    TurnAgentsOnAction,
} from "../../state/selection/types";
import { receiveAgentTypeIds } from "../../state/metadata/actions";
import { ReceiveAction } from "../../state/metadata/types";

const styles = require("./style.css");

interface ViewerPanelProps {
    time: number;
    numberPanelsCollapsed: number;
    changeTime: ActionCreator<ChangeTimeAction>;
    timeStep: number;
    turnAgentsOn: ActionCreator<TurnAgentsOnAction>;
    receiveAgentTypeIds: ActionCreator<ReceiveAction>;
    highlightedId: string;
}

interface ViewerPanelState {
    isPlaying: boolean;
    isInitialPlay: boolean;
    highlightId: number;
    particleTypeIds: string[];
    height: number;
    width: number;
    stopTime: number;
}

const netConnectionSettings = {
    serverIp: "52.15.70.94",
    serverPort: 9002,
};

const agentSim = new AgentSimController(netConnectionSettings, {
    trajectoryPlaybackFile: "actin19.h5",
});

class ViewerPanel extends React.Component<ViewerPanelProps, ViewerPanelState> {
    private animationTimer: number | null;
    private centerContent = React.createRef<HTMLDivElement>();

    constructor(props: ViewerPanelProps) {
        super(props);
        this.animationTimer = null;
        this.playBackOne = this.playBackOne.bind(this);
        this.playForwardOne = this.playForwardOne.bind(this);
        this.playFoward = this.playFoward.bind(this);
        this.startPlay = this.startPlay.bind(this);
        this.pause = this.pause.bind(this);
        this.receiveTimeChange = this.receiveTimeChange.bind(this);
        this.handleJsonMeshData = this.handleJsonMeshData.bind(this);
        this.onTrajectoryFileInfoChanged = this.onTrajectoryFileInfoChanged.bind(
            this
        );
        this.resize = this.resize.bind(this);
        this.state = {
            isPlaying: false,
            isInitialPlay: true,
            highlightId: -1,
            particleTypeIds: [],
            height: 0,
            width: 0,
            stopTime: 0,
        };
    }

    public resize(current: HTMLDivElement) {
        const width = current.offsetWidth;
        const height = current.offsetHeight;
        this.setState({ height, width });
    }

    public componentDidMount() {
        const current = this.centerContent.current;
        // agentSim.initializeTrajectoryFile();
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
        const { time, changeTime, timeStep } = this.props;
        agentSim.playFromTime(time + timeStep);
        this.setState({ stopTime: time + timeStep });
    }

    public playBackOne() {
        const { time, changeTime, timeStep } = this.props;
        if (time - timeStep >= 0) {
            agentSim.playFromTime(time - timeStep);
            this.setState({ stopTime: time - timeStep });
        }
    }

    public playFoward(isInitalPlay: boolean) {
        if (isInitalPlay || this.state.isPlaying) {
            this.playForwardOne();

            this.animationTimer = window.setTimeout(
                () => this.playFoward(false),
                100
            );
        }
    }

    public handleJsonMeshData(jsonData: any) {
        const { receiveAgentTypeIds, turnAgentsOn } = this.props;
        const particleTypeIds = Object.keys(jsonData);
        turnAgentsOn(particleTypeIds);
        receiveAgentTypeIds(particleTypeIds);
    }

    public highlightParticleType(typeId: number) {
        const highlightId = typeId;
        this.setState({ highlightId });
    }

    public startPlay() {
        const { time } = this.props;
        if (this.state.isPlaying) {
            return;
        }
        if (this.state.isInitialPlay) {
            agentSim.start();
            this.setState({ isInitialPlay: false });
        } else {
            agentSim.playFromTime(time);
        }
        this.setState({ isPlaying: true });
    }

    public pause() {
        agentSim.pause();
        this.setState({ isPlaying: false });
    }

    public onTrajectoryFileInfoChanged(data) {
        const { receiveMetadata } = this.props;
        console.log(data);
        receiveMetadata({
            totalTime: data.numberOfFrames, //TODO: change this once the backend sends this data
            timeStepSize: data.timeStepSize,
        });
    }

    public receiveTimeChange(timeData: any) {
        const { changeTime, timeStep } = this.props;
        console.log(timeData.time);
        if (
            this.state.stopTime &&
            Math.abs(timeData.time - this.state.stopTime) <= timeStep
        ) {
            console.log("stop");
            agentSim.pause();
            this.setState({
                stopTime: 0,
                isPlaying: false,
            });
        }
        return changeTime(timeData.time);
    }

    public skipToTime(time) {
        agentSim.pause();
        agentSim.playFromTime(time);
    }

    public render(): JSX.Element {
        const { time, changeTime, totalTime, highlightedId } = this.props;
        return (
            <div ref={this.centerContent} className={styles.container}>
                <ThreeDViewer
                    time={time}
                    width={this.state.width}
                    height={this.state.height}
                    agentSim={agentSim}
                    onTimeChange={this.receiveTimeChange}
                    highlightId={highlightedId}
                    handleJsonMeshData={this.handleJsonMeshData}
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
        highlightedId: getHightlightedId(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
    receiveMetadata,
    receiveAgentTypeIds,
    turnAgentsOn,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
