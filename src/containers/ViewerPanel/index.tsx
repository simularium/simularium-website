import * as React from "react";
import { ActionCreator } from "redux";
import { AgentSimController } from "agentviz-viewer";

import ThreeDViewer from "../../components/Viewer";
import {
    getCurrentTime,
    getNumberCollapsed,
} from "../../state/selection/selectors";
import { State } from "../../state/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import PlaybackControls from "../../components/PlaybackControls";
import { ChangeTimeAction } from "../../state/selection/types";

const styles = require("./style.css");

interface ViewerPanelProps {
    time: number;
    numberPanelsCollapsed: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

interface ViewerPanelState {
    isPlaying: boolean;
    isInitialPlay: boolean;
    highlightId: number;
    particleTypeIds: string[];
    height: number;
    width: number;
}

const netConnectionSettings = {
    serverIp: "52.15.70.94",
    serverPort: 9002,
};

const agentSim = new AgentSimController(netConnectionSettings, {
    trajectoryPlaybackFile: "actin19.h5",
});

const interval = 500;

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
        this.resize = this.resize.bind(this);
        this.state = {
            isPlaying: false,
            isInitialPlay: true,
            highlightId: -1,
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
        const { time, changeTime } = this.props;
        changeTime(time + interval);
    }

    public playBackOne() {
        const { time, changeTime } = this.props;
        if (time - interval >= 0) {
            changeTime(time - interval);
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
        const particleTypeIds = Object.keys(jsonData);
        this.setState({ particleTypeIds });
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

    public receiveTimeChange(timeData: any) {
        const { changeTime } = this.props;
        return changeTime(timeData.time);
    }

    public render(): JSX.Element {
        const { time } = this.props;
        return (
            <div ref={this.centerContent} className={styles.container}>
                <ThreeDViewer
                    time={time}
                    width={this.state.width}
                    height={this.state.height}
                    agentSim={agentSim}
                    onTimeChange={this.receiveTimeChange}
                    highlightId={this.state.highlightId}
                    handleJsonMeshData={this.handleJsonMeshData}
                />
                <PlaybackControls
                    playHandler={this.startPlay}
                    time={time}
                    pauseHandler={this.pause}
                    prevHandler={this.playBackOne}
                    nextHandler={this.playForwardOne}
                    isPlaying={this.state.isPlaying}
                />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: getCurrentTime(state),
        numberPanelsCollapsed: getNumberCollapsed(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ViewerPanel);
