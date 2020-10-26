import * as React from "react";
import Plot from "react-plotly.js";
import { ActionCreator } from "redux";

import { ChangeTimeAction } from "../../state/selection/types.js";
import { PlotParamsWithKey } from "../../containers/ResultsPanel/types";

interface PlotsProps {
    plotConfig: PlotParamsWithKey[];
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

export default class Plots extends React.Component<PlotsProps, {}> {
    public render(): JSX.Element | null {
        const { plotConfig } = this.props;
        return (
            <div className={styles.container}>
                {plotConfig.map((plot: PlotParamsWithKey) => {
                    return (
                        <Plot
                            key={plot.key}
                            data={plot.data}
                            useResizeHandler={true}
                            layout={plot.layout}
                            config={{ displayModeBar: false }}
                            // onClick={onPointClicked}
                            // onClickAnnotation={this.clickedAnnotation}
                            // onHover={onPlotHovered}
                            // onSelected={onGroupSelected}
                        />
                    );
                })}
            </div>
        );
    }
}
