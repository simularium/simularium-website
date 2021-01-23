import * as React from "react";
import { connect } from "react-redux";
import PlotlyPlot from "react-plotly.js";
// import { PlotData } from "plotly.js";
// import { ActionCreator } from "redux";

import { State } from "../../state/types";
import { PlotConfig } from "../../containers/ResultsPanel/types";
import { getCurrentTime } from "../../state/selection/selectors";
// import { changeTime } from "../../state/selection/actions";
// import { ChangeTimeAction } from "../../state/selection/types";
import { PLOT_STYLE } from "../../containers/ResultsPanel/constants";

interface PlotProps {
    plotConfig: PlotConfig;
    time: number;
    // changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

class Plot extends React.Component<PlotProps, {}> {
    shouldComponentUpdate() {
        return this.props.plotConfig.hasTimeIndicator;
    }

    public render(): JSX.Element | null {
        const { plotConfig, time } = this.props;
        const { hasTimeIndicator, data, layout } = plotConfig;
        const SIMULARIUM_TIME_INDICATOR = "simulariumTimeIndicator";

        // Add time indicator line for scatter plots with time on x-axis
        if (hasTimeIndicator && time !== 0) {
            // const timeIndicatorConfig: Partial<PlotData> = {
            //     /* cSpell:disable */
            //     name: SIMULARIUM_TIME_INDICATOR,
            //     mode: "lines",
            //     x: [time, time],
            //     y: [0, 1],
            //     xaxis: "x",
            //     yaxis: "y2",
            //     line: {
            //         width: 1,
            //         color: PLOT_STYLE.timeIndicatorColor,
            //     },
            //     showlegend: false,
            //     hoverinfo: "x",
            //     /* cSpell:enable */
            // };
            const lastPlot = data[data.length - 1];
            if (
                lastPlot.hasOwnProperty("name") &&
                lastPlot.name === SIMULARIUM_TIME_INDICATOR
            ) {
                lastPlot.x = [time, time];
            } else {
                data.push({
                    /* cSpell:disable */
                    name: SIMULARIUM_TIME_INDICATOR,
                    mode: "lines",
                    x: [time, time],
                    y: [0, 1],
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
    };
}

// const dispatchToPropsMap = {
//     changeTime,
// };

export default connect(
    mapStateToProps
    // dispatchToPropsMap
)(Plot);
