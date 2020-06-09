import * as React from "react";
import { ActionCreator } from "redux";
import { SimulariumController } from "@aics/simularium-viewer";
import { connect } from "react-redux";

import SimulariumViewer from "@aics/simularium-viewer";
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
import {
    ChangeTimeAction,
    TurnAgentsOnAction,
} from "../../state/selection/types";
import { receiveAgentTypeIds } from "../../state/metadata/actions";
import { ReceiveAction } from "../../state/metadata/types";

const styles = require("./style.css");

interface ViewerPanelProps {
    simulariumController: SimulariumController;
    time: number;
    numberPanelsCollapsed: number;
    changeTime: ActionCreator<ChangeTimeAction>;
    timeStep: number;
    turnAgentsOn: ActionCreator<TurnAgentsOnAction>;
    receiveAgentTypeIds: ActionCreator<ReceiveAction>;
    highlightedId: string;
    totalTime: number;
    receiveMetadata: ActionCreator<ReceiveAction>;
}

interface ViewerPanelState {
    isPlaying: boolean;
    isInitialPlay: boolean;
    highlightId: number;
    particleTypeIds: string[];
    height: number;
    width: number;
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
        changeTime(timeData.time);
    }

    public skipToTime(time: number) {
        const { simulariumController } = this.props;
        simulariumController.playFromTime(time);
    }

    public render(): JSX.Element {
        const {
            time,
            totalTime,
            highlightedId,
            simulariumController,
        } = this.props;
        return (
            <div ref={this.centerContent} className={styles.container}>
                <SimulariumViewer
                    height={this.state.height}
                    width={this.state.width}
                    devgui={false}
                    loggerLevel="off"
                    onTimeChange={this.receiveTimeChange}
                    simulariumController={simulariumController}
                    onJsonDataArrived={this.handleJsonMeshData}
                    highlightedParticleType={highlightedId}
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
