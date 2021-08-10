import {
    configureLayout,
    // configureData,
    // getShouldRenderTimeIndicator,
    // getPlotDataConfiguredForPlotly,
} from "./selectors";
import { PLOT_STYLE, AXIS_ATTRIBUTES } from "./constants";
import { Layout } from "./types";

const mockInputLayout: Layout = {
    title: "My Plot Title",
    xaxis: { title: "x-axis label" },
    yaxis: { title: "y-axis label" },
};

describe("ResultsPanel selectors and their helper functions", () => {
    describe("configureLayout", () => {
        it("Uses the default plot height if there is only 1 plot trace and the title is not long enough to wrap", () => {
            const result = configureLayout(mockInputLayout, 1);
            expect(result.height).toEqual(PLOT_STYLE.height);
        });
        it("Calculates correct plot height when there are multiple plot traces", () => {
            const result = configureLayout(mockInputLayout, 3);
            expect(result.height).toEqual(
                PLOT_STYLE.height + PLOT_STYLE.legendItemHeight * 3
            );
        });
        it("Transfers the plot title and axis titles correctly into the Plotly layout object", () => {
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
            const expectedXAxisTitle = {
                ...AXIS_ATTRIBUTES.title,
                text: "x-axis label",
            };
            const expectedYAxisTitle = {
                ...AXIS_ATTRIBUTES.title,
                text: "y-axis label",
            };
            expect(result.title).toEqual(expectedTitle);
            // expect(result.xaxis?.title).toStrictEqual(expectedXAxisTitle);
            // expect(result.yaxis?.title).toStrictEqual(expectedYAxisTitle);
        });
    });
    // describe("configureData", () => {
    //     it("Returns an agent visibility map with all possible states", () => {
    //     });
    // });
    // describe("getShouldRenderTimeIndicator", () => {
    //     it("Returns an agent visibility map with all possible states", () => {
    //     });
    // });
    // describe("getPlotDataConfiguredForPlotly", () => {
    //     it("Returns an agent visibility map with all possible states", () => {
    //     });
    // });
});
