import * as ReactDOM from "react-dom";
import * as React from "react";

import AgentVizViewer, { AgentSimController } from "agentviz-viewer";
// import './style.css';

const netConnectionSettings = {
    serverIp: "52.15.70.94",
    serverPort: 9002,
};

const agentSim = new AgentSimController(netConnectionSettings, {
    trajectoryPlaybackFile: "actin5-1.h5",
});

class ThreeDViewer extends React.Component {
    render() {
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
