import * as React from "react";
import {
    VictoryChart,
    VictoryLine,
    VictoryCursorContainer,
    VictoryAxis,
    VictoryTheme,
    VictoryScatter,
} from "victory";
import { map, min, max } from "lodash";
import { ActionCreator } from "redux";

import { ChangeTimeAction } from "../../state/selection/types.js";

interface GraphingProps {
    graphData: any;
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

interface ChartObject {
    type: string;
    x: number[];
    y: number[];
    "y-label": string;
    "x-label": string;
}

export default class Graphing extends React.Component<GraphingProps, {}> {
    // NOTE: the bool here is for the conditional in the map function.
    // technically that returns null and doesn't render, but it seems typescript doesnt know that
    public render(): (JSX.Element | boolean)[] {
        const { changeTime, time, graphData } = this.props;
        return map(graphData, (chart: ChartObject) => {
            return (
                chart.type === "scatterplot" && (
                    <VictoryChart
                        padding={{ top: 20, bottom: 80, left: 80, right: 50 }}
                        theme={VictoryTheme.material}
                        key={chart["y-label"]}
                    >
                        <VictoryScatter
                            style={{
                                data: {
                                    fill: (d) => (d.x < time ? "red" : "gray"),
                                    strokeWidth: 2,
                                },
                            }}
                            events={[
                                {
                                    target: "data",
                                    eventHandlers: {
                                        onClick: () => {
                                            return [
                                                {
                                                    target: "data",
                                                    mutation: (props) => {
                                                        console.log(props);
                                                        changeTime(
                                                            props.datum._x
                                                        );
                                                    },
                                                },
                                            ];
                                        },
                                    },
                                },
                            ]}
                            data={map(chart.x, (x, index) => {
                                return {
                                    x,
                                    y: chart.y[index],
                                };
                            })}
                            containerComponent={
                                <VictoryCursorContainer
                                    cursorDimension="x"
                                    cursorLabel={(d: any) => `${d.x}, ${d.y}`}
                                />
                            }
                        />
                        <VictoryAxis
                            dependentAxis
                            label={chart["y-label"]}
                            style={{ axisLabel: { padding: 50 } }}
                            tickFormat={(t) => `${t.toFixed(3)}`}
                        />

                        <VictoryAxis
                            label={chart["x-label"]}
                            style={{ axisLabel: { padding: 40 } }}
                            tickFormat={(t) => `${t / 1000}k`}
                        />
                        <VictoryLine
                            style={{
                                data: { stroke: "#c33409", strokeWidth: 1 },
                            }}
                            data={[
                                { x: time, y: min(chart.y) },
                                { x: time, y: max(chart.y) },
                            ]}
                        />
                    </VictoryChart>
                )
            );
        });
    }
}
