import * as React from "react";
import Plot from "react-plotly.js";
import { ActionCreator } from "redux";

import { ChangeTimeAction } from "../../state/selection/types.js";

import { PlotData, PlotInterface } from "./types";

interface PlotsProps {
    plotData: PlotData;
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

const styles = require("./style.css");

const PLOT_STYLE = {
    backgroundColor: "#1e1b25",
    backgroundTransparentColor: "#14121987",
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
    public render(): JSX.Element | null {
        const { plotData } = this.props;
        if (!plotData.data) {
            return null;
        }
        return (
            <div className={styles.container}>
                {plotData.data.map((plot: PlotInterface) => {
                    console.log(plot.layout);
                    const layout = {
                        /* cSpell:disable */
                        ...plot.layout,
                        autosize: true,
                        height: PLOT_STYLE.height,
                        width: PLOT_STYLE.width,
                        title: {
                            text: plot.layout.title,
                            font: {
                                family: "Overpass",
                                size: 16,
                            },
                            x: 0.05,
                            y: 0.95,
                        },
                        xaxis: {
                            ...plot.layout.xaxis,
                            automargin: true,
                        },
                        yaxis: {
                            ...plot.layout.yaxis,
                            automargin: true,
                        },
                        legend: {
                            bgcolor: PLOT_STYLE.backgroundTransparentColor,
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
                        /* cSpell:enable */
                    };
                    return (
                        <Plot
                            key={plot.layout.title}
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
