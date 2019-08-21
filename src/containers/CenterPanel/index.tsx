import * as React from "react";
import { Card, Collapse } from "antd";
import { ActionCreator } from "redux";
import { AgentSimController } from "agentviz-viewer";

import ThreeDViewer from "../../components/Viewer";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import PlaybackControls from "../../components/PlaybackControls";
import { ChangeTimeAction } from "../../state/selection/types";

interface CenterPanelProps {
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

interface CenterPanelState {
    isPlaying: boolean;
}

const netConnectionSettings = {
    serverIp: "52.15.70.94",
    serverPort: 9002,
};

const agentSim = new AgentSimController(netConnectionSettings, {
    trajectoryPlaybackFile: "actin5-1.h5",
});

const interval = 500;

class CenterPanel extends React.Component<CenterPanelProps, CenterPanelState> {
    private animationTimer: number | null;
    constructor(props: CenterPanelProps) {
        super(props);
        this.animationTimer = null;
        this.playBackOne = this.playBackOne.bind(this);
        this.playForwardOne = this.playForwardOne.bind(this);
        this.playFoward = this.playFoward.bind(this);
        this.startPlay = this.startPlay.bind(this);
        this.pause = this.pause.bind(this);
        this.state = {
            isPlaying: false,
        };
    }

    public playForwardOne() {
        const { time, changeTime } = this.props;
        changeTime(time + interval);
    }

    public playBackOne() {
        const { time, changeTime } = this.props;
        changeTime(time - interval);
    }

    public playFoward(isInitalPlay: boolean) {
        if (isInitalPlay || this.state.isPlaying) {
            this.playForwardOne();
            // will always be defined because has a default value, but not required prop
            // truthy check will return false for 0, so just reset it.
            // const interval: number = animSpeed || 0;

            this.animationTimer = window.setTimeout(
                () => this.playFoward(false),
                100
            );
        }
    }

    public startPlay() {
        if (this.state.isPlaying) {
            return;
        }
        agentSim.start();
        this.setState({ isPlaying: true });
        this.playFoward(true);
    }

    public pause() {
        console.log("pause");
        agentSim.pause();

        this.setState({ isPlaying: false });
    }

    public render(): JSX.Element {
        const { time } = this.props;
        return (
            <>
                <ThreeDViewer time={time} agentSim={agentSim} />
                <PlaybackControls
                    playHandler={this.startPlay}
                    time={time}
                    pauseHandler={this.pause}
                    prevHandler={this.playBackOne}
                    nextHandler={this.playForwardOne}
                    isPlaying={this.state.isPlaying}
                />
            </>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: getCurrentTime(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(CenterPanel);
