import {
    getPlotHeight,
    getTopMargin,
    configureLayout,
    configureData,
    getShouldRenderTimeIndicator,
    // getPlotDataConfiguredForPlotly,
} from "./selectors";
import { PLOT_STYLE, AXIS_ATTRIBUTES, DATA_STYLE } from "./constants";
import { Layout, ScatterTrace, HistogramTrace, RawPlotParams } from "./types";

const mockInputLayout: Layout = {
    title: "My Plot Title",
    xaxis: { title: "x-axis title" },
    yaxis: { title: "y-axis title" },
};

describe("ResultsPanel selectors and their helper functions", () => {
    describe("getPlotHeight", () => {
        it("Returns the default plot height if there is only 1 plot trace and the title is not long enough to wrap", () => {
            const result = getPlotHeight(1, 1);
            expect(result).toEqual(PLOT_STYLE.height);
        });
        it("Calculates correct plot height when there are multiple plot traces", () => {
            const result = getPlotHeight(3, 1);
            const expected =
                PLOT_STYLE.height + PLOT_STYLE.legendItemHeight * 3;
            expect(result).toEqual(expected);
        });
        it("Calculates correct plot height when the title is multi-line", () => {
            const result = getPlotHeight(1, 3);
            const expected =
                PLOT_STYLE.height + PLOT_STYLE.titleHeightPerLine * 2;
            expect(result).toEqual(expected);
        });
    });

    describe("getTopMargin", () => {
        it("Calculates the correct top margin", () => {
            const result = getTopMargin(4);
            const expected =
                PLOT_STYLE.marginTop + PLOT_STYLE.titleHeightPerLine * 3;
            expect(result).toEqual(expected);
        });
    });

    describe("configureLayout", () => {
        it("Transforms the plot title and axis titles correctly into the Plotly layout object", () => {
            const result = configureLayout(mockInputLayout, 1);
            const expectedTitle = {
                text: "My Plot Title",
                font: {
                    size: PLOT_STYLE.titleFontSize,
                },
                x: PLOT_STYLE.titlePositionX,
                y: PLOT_STYLE.titlePositionY,
                yanchor: "top",
            };
            const expectedXAxis = {
                ...AXIS_ATTRIBUTES,
                title: {
                    ...AXIS_ATTRIBUTES.title,
                    text: "x-axis title",
                },
                ticks: "inside",
                tickcolor: PLOT_STYLE.textColor,
                hoverformat: ".1f",
            };
            const expectedYAxis = {
                ...AXIS_ATTRIBUTES,
                title: {
                    ...AXIS_ATTRIBUTES.title,
                    text: "y-axis title",
                },
                ticks: "inside",
                tickcolor: PLOT_STYLE.textColor,
                hoverformat: ".2f",
            };
            expect(result.title).toStrictEqual(expectedTitle);
            expect(result.xaxis).toStrictEqual(expectedXAxis);
            expect(result.yaxis).toStrictEqual(expectedYAxis);
        });
    });

    describe("configureData", () => {
        it("Adds line and marker styling to plot data in Plotly format", () => {
            const mockPlotData: (ScatterTrace | HistogramTrace)[] = [
                {
                    x: [1, 2, 3],
                    y: [1, 2, 3],
                    mode: "markers",
                    type: "scatter",
                },
            ];
            const result = configureData(mockPlotData);
            const expected = [
                {
                    x: [1, 2, 3],
                    y: [1, 2, 3],
                    mode: "markers",
                    type: "scatter",
                    line: {
                        width: DATA_STYLE.lineWidth,
                    },
                    marker: {
                        size: DATA_STYLE.markerSize,
                        line: {
                            color: PLOT_STYLE.backgroundColor,
                            width: DATA_STYLE.markerLineWidth,
                        },
                    },
                },
            ];
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getShouldRenderTimeIndicator", () => {
        it("Returns false if the plot is a histogram", () => {
            const mockPlotParams: RawPlotParams = {
                data: [
                    {
                        x: [1, 2, 3],
                        y: [1, 2, 3],
                        type: "histogram",
                    },
                ],
                layout: mockInputLayout,
            };
            expect(getShouldRenderTimeIndicator(mockPlotParams)).toBe(false);
        });
        it("Returns false if the plot is a scatter plot but not a time series", () => {
            const mockPlotParams: RawPlotParams = {
                data: [
                    {
                        x: [1, 2, 3],
                        y: [1, 2, 3],
                        mode: "markers",
                        type: "scatter",
                    },
                ],
                layout: mockInputLayout,
            };
            expect(getShouldRenderTimeIndicator(mockPlotParams)).toBe(false);
        });
        it("Returns true if the plot is a scatter plot of a time series", () => {
            const mockLayout: Layout = {
                title: "My Plot Title",
                xaxis: { title: "Time since mitosis (ns)" },
                yaxis: { title: "y-axis title" },
            };
            const mockPlotParams: RawPlotParams = {
                data: [
                    {
                        x: [1, 2, 3],
                        y: [1, 2, 3],
                        mode: "markers",
                        type: "scatter",
                    },
                ],
                layout: mockLayout,
            };
            expect(getShouldRenderTimeIndicator(mockPlotParams)).toBe(true);
        });
    });

    // describe("getPlotDataConfiguredForPlotly", () => {
    //     it("Returns an agent visibility map with all possible states", () => {
    //     });
    // });
});
