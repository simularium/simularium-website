import * as React from "react";
import Plot from "react-plotly.js";
import { map, min, max } from "lodash";
import { ActionCreator } from "redux";

import { ChangeTimeAction } from "../../state/selection/types.js";

import { PlotInterface } from "./types";

interface PlotsProps {
    plotData: any;
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

const PLOT_STYLE = {
    backgroundColor: "#1e1b25",
    textColor: "#d3d3d3",
    borderColor: "#737373",
    fontSize: 11,
    marginAxis: 60,
    marginTop: 60,
    marginDefault: 10,
    colorway: ["#c9e358", "#12e9ff", "#005097"],
    height: 300,
    width: 260,
};

export default class Plots extends React.Component<PlotsProps, {}> {
    public render(): JSX.Element {
        const { changeTime, time, plotData } = this.props;
        console.log(plotData);
        return (
            <div className={styles.container}>
                {map(plotData, (plot: PlotInterface) => {
                    const layout = {
                        ...plot.layout,
                        autosize: true,
                        height: PLOT_STYLE.height,
                        width: PLOT_STYLE.width,
                        xaxis: {
                            ...plot.layout.xaxis,
                            automargin: true,
                        },
                        yaxis: {
                            ...plot.layout.yaxis,
                            automargin: true,
                        },
                        legend: {
                            bgcolor: "#14121987",
                            font: {
                                color: PLOT_STYLE.textColor,
                                size: PLOT_STYLE.fontSize,
                            },
                            // orientation: "h" as "h",
                            bordercolor: PLOT_STYLE.borderColor,
                            borderwidth: 0.5,
                            xanchor: "right" as "right",
                            x: 1,
                            y: 1,
                        },
                        margin: {
                            t: PLOT_STYLE.marginAxis,
                            l: PLOT_STYLE.marginAxis,
                            b: PLOT_STYLE.marginAxis,
                            r: PLOT_STYLE.marginDefault,
                        },
                        font: {
                            color: PLOT_STYLE.textColor,
                            size: PLOT_STYLE.fontSize,
                        },
                        colorway: PLOT_STYLE.colorway,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        paper_bgcolor: PLOT_STYLE.backgroundColor,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        plot_bgcolor: PLOT_STYLE.backgroundColor,
                    };
                    return (
                        <Plot
                            data={plot.data}
                            useResizeHandler={true}
                            layout={layout}
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
