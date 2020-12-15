import { createSelector } from "reselect";
import { Layout, Data } from "plotly.js";

import { getPlotData } from "../../state/metadata/selectors";
import { getCurrentTime } from "../../state/selection/selectors";
import { wrapText } from "../../util";

import { PLOT_STYLE, AXIS_ATTRIBUTES } from "./constants";
import {
    PlotParamsWithKey,
    RawPlotParams,
    ScatterTrace,
    HistogramTrace,
    Layout as InputLayout,
} from "./types";

// Add Plotly layout and styling attributes to raw input plot data
// Plotly reference: https://plotly.com/javascript/reference/index/
const configureLayout = (
    layout: InputLayout,
    numTraces: number
): Partial<Layout> => {
    // Give plots with a legend (multi-trace plots) more vertical room
    const plotHeight =
        numTraces > 1
            ? PLOT_STYLE.height + PLOT_STYLE.legendItemHeight * numTraces
            : PLOT_STYLE.height;

    // 33 characters seems to be approximately the max title length that can fit in
    // one line in the current layout
    const maxCharPerLine = 33;
    const wrappedTitle = wrapText(layout.title, maxCharPerLine);
    const numLinesInTitle = wrappedTitle.numLines;
    console.log(numLinesInTitle);
    const topMargin =
        PLOT_STYLE.marginTop +
        PLOT_STYLE.titleHeightPerLine * (numLinesInTitle - 1);

    return {
        ...layout,
        /* cSpell:disable */
        autosize: true,
        height:
            plotHeight + PLOT_STYLE.titleHeightPerLine * (numLinesInTitle - 1),
        // height: plotHeight,
        width: PLOT_STYLE.width,
        title: {
            text: wrappedTitle.formattedText,
            font: {
                size: 16,
            },
            x: 0.03,
            y: 0.94,
            yanchor: "top",
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
                text: layout.xaxis.title,
            },
            ticks: "inside",
            tickcolor: PLOT_STYLE.textColor,
            hoverformat: ".1f", // Show 1 decimal place
        },
        yaxis: {
            ...AXIS_ATTRIBUTES,
            title: {
                ...AXIS_ATTRIBUTES.title,
                text: layout.yaxis.title,
            },
            ticks: "inside",
            tickcolor: PLOT_STYLE.textColor,
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
            t: topMargin,
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
};

const configureData = (
    inputData: (ScatterTrace | HistogramTrace)[],
    currentTime: number,
    xAxisTitle: string
): Data[] => {
    // Add line and marker styling to data
    const data: Data[] = inputData.map(
        (traceData: ScatterTrace | HistogramTrace) => {
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
        }
    );

    // Type guard for checking if a plot is a scatter plot
    const isScatterPlot = (
        data: (ScatterTrace | HistogramTrace)[]
    ): data is ScatterTrace[] => {
        return data[0].type === "scatter";
    };
    // Check if the x-axis label has the word "time" in it, separated from other
    // characters by whitespace and/or one or more special characters
    const isTimePlot = /\btime\b/i.test(xAxisTitle);

    // Add time indicator line for scatter plots with time on x-axis
    if (isScatterPlot(inputData) && isTimePlot && currentTime !== 0) {
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

    return data;
};

export const getPlotDataConfiguredForPlotly = createSelector(
    [getPlotData, getCurrentTime],
    (plotData: RawPlotParams[], currentTime: number): PlotParamsWithKey[] => {
        if (!plotData) return [];
        return plotData.map((plot: RawPlotParams) => {
            const layout: Partial<Layout> = configureLayout(
                plot.layout,
                plot.data.length
            );
            const data: Data[] = configureData(
                plot.data,
                currentTime,
                plot.layout.xaxis.title
            );
            return {
                key: plot.layout.title,
                data: data,
                layout: layout,
            };
        });
    }
);
