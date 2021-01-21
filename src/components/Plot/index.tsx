import * as React from "react";
import PlotlyPlot from "react-plotly.js";
// import { ActionCreator } from "redux";

// import { ChangeTimeAction } from "../../state/selection/types.js";
import { PlotParamsWithKey } from "../../containers/ResultsPanel/types";

interface PlotProps {
    plotConfig: PlotParamsWithKey;
    // time: number;
    // changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

export default class Plot extends React.Component<PlotProps, {}> {
    public render(): JSX.Element | null {
        const { plotConfig } = this.props;
        return (
            <div className={styles.container}>
                <PlotlyPlot
                    key={plotConfig.key}
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
