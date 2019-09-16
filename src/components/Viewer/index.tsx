import * as React from "react";
import AgentVizViewer from "agentviz-viewer";

interface ThreeDViewerProps {
    agentSim: any;
    onTimeChange: any;
    time: number;
    handleJsonMeshData: (jsonData: any) => void;
    highlightId: number;
    height: number;
    width: number;
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
        const {
            agentSim,
            onTimeChange,
            time,
            handleJsonMeshData,
            highlightId,
            width,
            height,
        } = this.props;
        return (
            <React.Fragment>
                <button onClick={() => agentSim.start()}>Start</button>
                <button onClick={() => agentSim.pause()}>Pause</button>
                <button onClick={() => agentSim.playFromCache(time)}>
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
                    height={height}
                    width={width}
                    devgui={false}
                    loggerLevel="debug"
                    onTimeChange={onTimeChange}
                    agentSimController={agentSim}
                    onJsonDataArrived={handleJsonMeshData}
                    highlightedParticleType={highlightId}
                />
            </React.Fragment>
        );
    }
}

export default ThreeDViewer;
