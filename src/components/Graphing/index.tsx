import React from "react";
import { VictoryChart, VictoryLine, VictoryCursorContainer } from "victory";

export default class Graphing extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <VictoryChart>
                <VictoryLine
                    style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc" },
                    }}
                    data={[
                        { x: 0, y: 0 },
                        { x: 25000, y: 318 },
                        { x: 50000, y: 635 },
                        { x: 75000, y: 1070 },
                        { x: 100000, y: 1623 },
                    ]}
                    containerComponent={
                        <VictoryCursorContainer
                            cursorDimension="x"
                            cursorLabel={(d: any) => `${d.x}, ${d.y}`}
                        />
                    }
                />
            </VictoryChart>
        );
    }
}
