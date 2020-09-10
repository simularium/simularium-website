import * as React from "react";
import { Card } from "antd";

import { TrajectoryDisplayData } from "../../constants/interfaces";

const styles = require("./style.css");

interface ModelCardProps {
    trajectory: TrajectoryDisplayData;
}

class ModelCard extends React.Component<ModelCardProps, {}> {
    public render(): JSX.Element {
        const { trajectory } = this.props;
        const {
            title,
            totalSimulatedTime,
            authors,
            publication,
            description,
        } = trajectory;
        return (
            <Card
                style={{
                    width: 300,
                    padding: 10,
                }}
                cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
            >
                {/* TODO: add class name and styling to this div */}
                <div>
                    <p>{totalSimulatedTime}</p>
                    <p>{title.toUpperCase()}</p>
                    <p>{authors}</p>
                    <p>{publication.title}</p>
                    <p>{description}</p>
                </div>
            </Card>
        );
    }
}

export default ModelCard;
