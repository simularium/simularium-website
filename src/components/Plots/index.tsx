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

const COLORS = {
    darkTwo: "#1e1b25",
    whiteTwo: "#d3d3d3",
};

const PLOT_STYLE = {
    axisColor: COLORS.whiteTwo,
    axisTitleSize: 12,
    axisTitleStandoff: 3,
    backgroundColor: COLORS.darkTwo,
    backgroundTransparentColor: "#14121987",
    textColor: COLORS.whiteTwo,
    borderColor: "#737373",
    fontFamily: "Overpass",
    fontSize: 11,
    marginTop: 40,
    marginLeft: 50,
    marginBottom: 30,
    marginRight: 5,
    colorway: ["#c9e358", "#12e9ff", "#005097"],
    height: 300,
    width: 260,
};

export default class Plots extends React.Component<PlotsProps, {}> {
    public render(): JSX.Element | null {
        const { plotData } = this.props;
        return (
            <div className={styles.container}>
                {plotData.data.map((plot: PlotInterface) => {
                    console.log(plot.data);
                    /* cSpell:disable */
                    const layout = {
                        ...plot.layout,
                        autosize: true,
                        height: PLOT_STYLE.height,
                        width: PLOT_STYLE.width,
                        title: {
                            text: plot.layout.title,
                            font: {
                                size: 16,
                            },
                            x: 0.03,
                            y: 0.97,
                        },
                        xaxis: {
                            showline: true,
                            linecolor: PLOT_STYLE.axisColor,
                            title: {
                                text: plot.layout.xaxis.title,
                                size: PLOT_STYLE.axisTitleSize,
                                standoff: PLOT_STYLE.axisTitleStandoff,
                            },
                            automargin: true,
                            showgrid: false,
                            zeroline: false,
                        },
                        yaxis: {
                            showline: true,
                            linecolor: PLOT_STYLE.axisColor,
                            title: {
                                text: plot.layout.yaxis.title,
                                size: PLOT_STYLE.axisTitleSize,
                                standoff: PLOT_STYLE.axisTitleStandoff,
                            },
                            automargin: true,
                            showgrid: false,
                            zeroline: false,
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
                            t: PLOT_STYLE.marginTop,
                            l: PLOT_STYLE.marginLeft,
                            b: PLOT_STYLE.marginBottom,
                            r: PLOT_STYLE.marginRight,
                        },
                        font: {
                            family: PLOT_STYLE.fontFamily,
                            color: PLOT_STYLE.textColor,
                            size: PLOT_STYLE.fontSize,
                        },
                        colorway: PLOT_STYLE.colorway,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        paper_bgcolor: PLOT_STYLE.backgroundColor,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        plot_bgcolor: PLOT_STYLE.backgroundColor,
                    };

                    const data = plot.data.map((curveData) => {
                        return {
                            ...curveData,
                            line: {
                                width: 1,
                            },
                            marker: {
                                size: 2,
                            },
                        };
                    });
                    /* cSpell:enable */

                    console.log(data);
                    return (
                        <Plot
                            key={plot.layout.title}
                            data={data}
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
