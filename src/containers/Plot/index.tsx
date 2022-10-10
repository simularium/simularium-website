import * as React from "react";
import { connect } from "react-redux";
import { Waypoint } from "react-waypoint";
import PlotlyPlot from "react-plotly.js";
import { PlotData } from "plotly.js";
// TODO: Use changeTime action to allow updating of app time by dragging the
// time indicator bar
// import { ActionCreator } from "redux";

import { State } from "../../state/types";
import { PlotConfig } from "../ResultsPanel/types";
import { getCurrentTime } from "../../state/selection/selectors";
// import { changeTime } from "../../state/selection/actions";
// import { ChangeTimeAction } from "../../state/selection/types";
import { PLOT_STYLE } from "../ResultsPanel/constants";

interface PlotProps {
    plotConfig: PlotConfig;
    time: number;
    // changeTime: ActionCreator<ChangeTimeAction>;
}

interface PlotState {
    isInView: boolean;
}

import styles from "./style.css";
const TIME_INDICATOR_LINE = "timeIndicatorLine";

class Plot extends React.Component<PlotProps, PlotState> {
    constructor(props: PlotProps) {
        super(props);
        this.state = {
            isInView: false,
        };
    }
    componentDidMount() {
        const { plotConfig, time } = this.props;
        if (plotConfig.shouldRenderTimeIndicator) {
            // Add a new plot trace representing the time indicator line, positioned at initial time
            // Plotly reference: https://plotly.com/javascript/reference/index/
            plotConfig.data.push({
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

    shouldComponentUpdate(nextProps: PlotProps, nextState: PlotState) {
        const { shouldRenderTimeIndicator } = this.props.plotConfig;
        return shouldRenderTimeIndicator && nextState.isInView;
    }

    public render(): JSX.Element | null {
        const { plotConfig, time } = this.props;
        const { shouldRenderTimeIndicator, data, layout } = plotConfig;

        if (shouldRenderTimeIndicator) {
            // Position the time indicator line at current time (the time indicator should be the last
            // plot trace in `data` because we pushed it to `data` in componentDidMount())
            const lastTrace = data[data.length - 1];
            if (lastTrace.name === TIME_INDICATOR_LINE) {
                (lastTrace as PlotData).x = [time, time];
            }
        }

        return (
            <Waypoint
                key={layout.title as string}
                onEnter={() => this.setState({ isInView: true })}
                onLeave={() => this.setState({ isInView: false })}
                topOffset={50}
                bottomOffset={50}
            >
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
            </Waypoint>
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
