import * as React from "react";
import { Card } from "antd";

import { TrajectoryDisplayData } from "../../constants/interfaces";

const { Meta } = Card;

const styles = require("./style.css");

interface ModelCardProps {
    trajectory: TrajectoryDisplayData;
}

class ModelCard extends React.Component<ModelCardProps, {}> {
    public render(): JSX.Element {
        const { trajectory } = this.props;
        return (
            <Card
                style={{
                    width: 300,
                }}
                cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
            >
                <span>{trajectory.totalSimulatedTime}</span>
                <Meta
                    title={trajectory.title}
                    description={trajectory.description}
                />
            </Card>
        );
    }
}

export default ModelCard;
