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
            handleJsonMeshData,
            highlightId,
            width,
            height,
            onTrajectoryFileInfoChanged,
        } = this.props;
        return (
            <>
                <AgentVizViewer
                    height={height}
                    width={width}
                    devgui={false}
                    loggerLevel="debug"
                    onTimeChange={onTimeChange}
                    agentSimController={agentSim}
                    onJsonDataArrived={handleJsonMeshData}
                    highlightedParticleType={highlightId}
                    onTrajectoryFileInfoChanged={onTrajectoryFileInfoChanged}
                />
            </>
        );
    }
}

export default ThreeDViewer;
