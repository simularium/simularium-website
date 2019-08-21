import * as ReactDOM from "react-dom";
import * as React from "react";
import AgentVizViewer from "agentviz-viewer";

import PlaybackControls from "../PlaybackControls";
import { changeTime } from "../../state/selection/actions";

// import './style.css';

interface ThreeDViewerProps {
    time: number;
    agentSim: any;
}

interface ThreeDViewerState {
    isPlaying: boolean;
}

class ThreeDViewer extends React.Component<
    ThreeDViewerProps,
    ThreeDViewerState
> {
    constructor(props: ThreeDViewerProps) {
        super(props);
        this.state = {
            isPlaying: true,
        };
    }
    render() {
        const { agentSim, time } = this.props;
        return (
            <React.Fragment>
                <button onClick={() => agentSim.start()}>Start</button>
                <button onClick={() => agentSim.pause()}>Pause</button>
                <button onClick={() => agentSim.playFromCache()}>
                    Play from cache
                </button>
                <button onClick={() => agentSim.stop()}>stop</button>
                <button
                    onClick={() => agentSim.changeFile("microtubules15.h5")}
                >
                    Microtubules file
                </button>
                <button onClick={() => agentSim.changeFile("actin5-1.h5")}>
                    actin file
                </button>
                <AgentVizViewer
                    height={600}
                    width={600}
                    devgui={false}
                    loggerLevel="debug"
                    agentSimController={agentSim}
                />
            </React.Fragment>
        );
    }
}

export default ThreeDViewer;
