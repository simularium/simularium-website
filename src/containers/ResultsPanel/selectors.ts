import { createSelector } from "reselect";
import { Shape, Layout } from "plotly.js";

import { getPlotData } from "../../state/metadata/selectors";

import { PLOT_STYLE, AXIS_ATTRIBUTES } from "./constants";
import {
    PlotParamsWithKey,
    RawPlotParams,
    ScatterTrace,
    HistogramTrace,
} from "./types";

// Using autorange I can't get the exact values of the y-axis range needed for drawing the vertical line (shape) so need to manually configure y axis.
// NOTE: Only call when not a histogram
const yAxisRange = (plot: ScatterTrace[]): number[] => {
    let yAxisMin: number | undefined;
    let yAxisMax: number | undefined;
    plot.forEach((trace) => {
        const localMin = Math.min(...trace.y);
        const localMax = Math.max(...trace.y);
        if (yAxisMin === undefined || localMin < yAxisMin) {
            yAxisMin = localMin;
        }
        if (yAxisMax === undefined || localMax > yAxisMax) {
            yAxisMax = localMax;
        }
    });

    if (yAxisMin === undefined || yAxisMax === undefined) return [];
    const padding = (yAxisMax - yAxisMin) * 0.05;
    return [yAxisMin - padding, yAxisMax + padding];
};

// const createTimeIndicatorLine = (plot: RawPlotParams): Partial<Shape>[] => {
//     let shapes = [];
//     if (plot.data[0].type === "scatter") {  // TODO: also check for time name on x axis
//         shapes.push({
//             type: "line" as "line",
//             x0: plot.data[0].x[1],
//             y0: getYAxisRange(plot)[0],
//             x1: plot.data[0].x[1],
//             y1: getYAxisRange(plot)[1],
//             line: {
//                 color: "#ffffff",
//                 width: 1,
//             },
//         })
//     }

//     return shapes;
// };

/*
1) Add Plotly layout and styling attributes to raw input plot data
    Plotly reference: https://plotly.com/javascript/reference/index/
2) Add a key to the plot data to make React happy when using array.map()
*/
export const configurePlots = createSelector(
    [getPlotData],
    (plotData: RawPlotParams[]): PlotParamsWithKey[] => {
        if (!plotData) return [];
        return plotData.map((plot: RawPlotParams) => {
            console.log(plot);
            // Give plots with a legend (multi-trace plots) more vertical room.
            const numTraces = plot.data.length;
            const plotHeight =
                numTraces > 1
                    ? PLOT_STYLE.height +
                      PLOT_STYLE.legendItemHeight * numTraces
                    : PLOT_STYLE.height;

            let layout: Partial<Layout> = {
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
                legend: {
                    xanchor: "left" as "left",
                    yanchor: "top" as "top",
                    x: 0,
                    y: -0.2,
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
                // shapes: createTimeIndicatorLine(plot),
                /* cSpell:enable */
            };

            // Use a custom y-axis range and display vertical time indicator line for scatter plots
            const isScatterTrace = (
                data: (ScatterTrace | HistogramTrace)[]
            ): data is ScatterTrace[] => {
                return data[0].type === "scatter";
            };
            if (isScatterTrace(plot.data)) {
                layout.yaxis = {
                    ...layout.yaxis,
                    range: yAxisRange(plot.data),
                };
            }

            // Add line and marker styling to data
            const data = plot.data.map((traceData) => {
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

            return {
                key: plot.layout.title,
                data: data,
                layout: layout,
            };
        });
    }
);
