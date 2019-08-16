import React from "react";
import {
    VictoryChart,
    VictoryLine,
    VictoryCursorContainer,
    VictoryAxis,
} from "victory";
import data from "./data_resultsUI.js";
import { map } from "lodash";

export default class Graphing extends React.Component<{}, {}> {
    public render(): JSX.Element[] {
        return map(data, (chart: any) => {
            return (
                <VictoryChart>
                    <VictoryLine
                        style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc" },
                        }}
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
                    <VictoryAxis dependentAxis label={chart["y-label"]} />

                    <VictoryAxis label={chart["x-label"]} />
                </VictoryChart>
            );
        });
    }
}
