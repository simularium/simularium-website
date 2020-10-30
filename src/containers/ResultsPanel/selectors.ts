import { createSelector } from "reselect";
import { Layout, Data } from "plotly.js";

import { getPlotData } from "../../state/metadata/selectors";
import { getCurrentTime } from "../../state/selection/selectors";

import { PLOT_STYLE, AXIS_ATTRIBUTES } from "./constants";
import {
    PlotParamsWithKey,
    RawPlotParams,
    ScatterTrace,
    HistogramTrace,
} from "./types";

/*
1) Add Plotly layout and styling attributes to raw input plot data
    Plotly reference: https://plotly.com/javascript/reference/index/
2) Add time indicator line for scatter plots that contain the word "time"
    in their x-axis label
3) Add a key to the plot data to make React happy when using array.map()
*/
export const configurePlots = createSelector(
    [getPlotData, getCurrentTime],
    (plotData: RawPlotParams[], currentTime: number): PlotParamsWithKey[] => {
        if (!plotData) return [];
        return plotData.map((plot: RawPlotParams) => {
            // Give plots with a legend (multi-trace plots) more vertical room.
            const numTraces = plot.data.length;
            const plotHeight =
                numTraces > 1
                    ? PLOT_STYLE.height +
                      PLOT_STYLE.legendItemHeight * numTraces
                    : PLOT_STYLE.height;

            const layout: Partial<Layout> = {
                ...plot.layout,
                /* cSpell:disable */
                autosize: true,
                height: plotHeight,
                width: PLOT_STYLE.width,
                title: {
                    text: plot.layout.title,
                    font: {
                        size: 16,
                    },
                    x: 0.03,
                    y: 0.97,
                },
                hoverlabel: {
                    font: {
                        family: PLOT_STYLE.fontFamily,
                    },
                    namelength: 0,
                },
                xaxis: {
                    ...AXIS_ATTRIBUTES,
                    title: {
                        ...AXIS_ATTRIBUTES.title,
                        text: plot.layout.xaxis.title,
                    },
                    hoverformat: ".1f", // Show 1 decimal place
                },
                yaxis: {
                    ...AXIS_ATTRIBUTES,
                    title: {
                        ...AXIS_ATTRIBUTES.title,
                        text: plot.layout.yaxis.title,
                    },
                    hoverformat: ".2f", // Show 2 decimal places
                },
                yaxis2: {
                    overlaying: "y",
                    range: [0, 1],
                    visible: false,
                },
                legend: {
                    xanchor: "left" as "left",
                    yanchor: "top" as "top",
                    x: 0,
                    y: -0.2,
                },
                showlegend: numTraces > 1 ? true : false,
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
                /* cSpell:enable */
            };

            // Add line and marker styling to data
            const data: Data[] = plot.data.map((traceData) => {
                return {
                    ...traceData,
                    line: {
                        width: 1,
                    },
                    marker: {
                        size: 3,
                        line: {
                            color: PLOT_STYLE.backgroundColor,
                            width: 0.5,
                        },
                    },
                };
            });

            // Type guard for checking if a plot is a scatter plot
            const isScatterPlot = (
                data: (ScatterTrace | HistogramTrace)[]
            ): data is ScatterTrace[] => {
                return data[0].type === "scatter";
            };
            // Check if the x-axis label has the word "time" in it, separated from other
            // characters by whitespace and/or one or more special characters
            const isTimePlot = /\btime\b/.test(plot.layout.xaxis.title);
            // Add time indicator line for scatter plots with time on x-axis
            if (isScatterPlot(plot.data) && isTimePlot && currentTime !== 0) {
                data.push({
                    /* cSpell:disable */
                    mode: "lines",
                    x: [currentTime, currentTime],
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

            return {
                key: plot.layout.title,
                data: data,
                layout: layout,
            };
        });
    }
);
