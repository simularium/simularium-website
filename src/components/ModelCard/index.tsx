import * as React from "react";
import { Card } from "antd";

import { TrajectoryDisplayData } from "../../constants/interfaces";

const styles = require("./style.css");

interface ModelCardProps {
    trajectory: TrajectoryDisplayData;
}

const ModelCard: React.FunctionComponent<ModelCardProps> = (
    props: ModelCardProps
) => {
    const {
        title,
        totalSimulatedTime,
        authors,
        publication,
        description,
    } = props.trajectory;
    return (
        <Card
            className={styles.card}
            cover={
                <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }
        >
            <div>
                <p>{totalSimulatedTime}</p>
                <p>{title.toUpperCase()}</p>
                <p>{authors}</p>
                <p>{publication.title}</p>
                <p>{description}</p>
            </div>
        </Card>
    );
};

export default ModelCard;
