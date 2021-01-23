import * as React from "react";
import { connect } from "react-redux";
import PlotlyPlot from "react-plotly.js";
// import { ActionCreator } from "redux";

import { State } from "../../state/types";
import { PlotConfig } from "../../containers/ResultsPanel/types";
import { getCurrentTime } from "../../state/selection/selectors";
// import { changeTime } from "../../state/selection/actions";
// import { ChangeTimeAction } from "../../state/selection/types";

interface PlotProps {
    plotConfig: PlotConfig;
    // time: number;
    // changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

export default class Plot extends React.Component<PlotProps, {}> {
    shouldComponentUpdate() {
        return this.props.plotConfig.hasTimeIndicator;
    }

    public render(): JSX.Element | null {
        const { plotConfig } = this.props;
        return (
            <div className={styles.container}>
                <PlotlyPlot
                    data={plotConfig.data}
                    useResizeHandler={true}
                    layout={plotConfig.layout}
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

// function mapStateToProps(state: State) {
//     return {
//         time: getCurrentTime(state),
//     };
// }

// const dispatchToPropsMap = {
//     changeTime,
// };

// export default connect(
//     mapStateToProps
//     // dispatchToPropsMap
// )(Plot);
