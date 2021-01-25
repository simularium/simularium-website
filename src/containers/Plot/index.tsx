import * as React from "react";
import { connect } from "react-redux";
import PlotlyPlot from "react-plotly.js";
// TODO: Use changeTime action to allow updating of app time by dragging the
// time indicator bar
// import { ActionCreator } from "redux";

import { State } from "../../state/types";
import { PlotConfig } from "../ResultsPanel/types";
import { getCurrentTime } from "../../state/selection/selectors";
// import { changeTime } from "../../state/selection/actions";
// import { ChangeTimeAction } from "../../state/selection/types";
import { getFirstFrameTimeOfCachedSimulation } from "../../state/metadata/selectors";
import { PLOT_STYLE } from "../ResultsPanel/constants";

interface PlotProps {
    plotConfig: PlotConfig;
    time: number;
    firstFrameTime: number;
    // changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

class Plot extends React.Component<PlotProps, {}> {
    shouldComponentUpdate() {
        return this.props.plotConfig.shouldRenderTimeIndicator;
    }

    public render(): JSX.Element | null {
        const { plotConfig, time, firstFrameTime } = this.props;
        const { shouldRenderTimeIndicator, data, layout } = plotConfig;
        const TIME_INDICATOR_LINE = "timeIndicatorLine";

        if (shouldRenderTimeIndicator && time !== firstFrameTime) {
            const lastPlot = data[data.length - 1];
            // Update the time for the time indicator line if it already exists,
            // otherwise add a time indicator line
            if (lastPlot.name === TIME_INDICATOR_LINE) {
                lastPlot.x = [time, time];
            } else {
                data.push({
                    // Plotly reference: https://plotly.com/javascript/reference/index/
                    name: TIME_INDICATOR_LINE,
                    mode: "lines",
                    x: [time, time],
                    y: [0, 1],
                    /* cSpell:disable */
                    xaxis: "x",
                    yaxis: "y2",
                    line: {
                        width: 1,
                        color: PLOT_STYLE.timeIndicatorColor,
                    },
                    showlegend: false,
                    hoverinfo: "x",
                    /* cSpell:enable */
                });
            }
        }

        return (
            <div className={styles.container}>
                <PlotlyPlot
                    data={data}
                    useResizeHandler={true}
                    layout={layout}
                    // config attributes:
                    // https://github.com/plotly/plotly.js/blob/master/src/plot_api/plot_config.js#L23
                    config={{
                        modeBarButtons: [["resetViews"]],
                        displaylogo: false,
                    }}
                />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: getCurrentTime(state),
        firstFrameTime: getFirstFrameTimeOfCachedSimulation(state),
    };
}

// const dispatchToPropsMap = {
//     changeTime,
// };

export default connect(
    mapStateToProps
    // dispatchToPropsMap
)(Plot);
