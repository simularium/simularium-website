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
    babyPurple: "#b59ff6",
};

const PLOT_STYLE = {
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
    colorway: [
        "#c9e358",
        "#12e9ff",
        "#005097",
        COLORS.babyPurple,
        COLORS.whiteTwo,
    ],
    height: 260,
    width: 260,
};

// Shared between x-axis and y-axis
const AXIS_ATTRIBUTES = {
    /* cSpell:disable */
    showline: true,
    linecolor: COLORS.whiteTwo,
    title: {
        size: 12,
        standoff: 3,
    },
    automargin: true,
    showgrid: false,
    zeroline: false,
    /* cSpell:enable */
};

export default class Plots extends React.Component<PlotsProps, {}> {
    public render(): JSX.Element | null {
        const { plotData } = this.props;
        return (
            <div className={styles.container}>
                {plotData.data.map((plot: PlotInterface) => {
                    // Give plots with a legend (multi-trace plots) more vertical room
                    const plotHeight =
                        plot.data.length > 1
                            ? PLOT_STYLE.height + 80
                            : PLOT_STYLE.height;

                    const layout = {
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
                        /* cSpell:enable */
                    };

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
