import * as React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";

import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { TrajectoryDisplayData } from "../../constants/interfaces";

const styles = require("./style.css");

interface ModelCardProps {
    trajectory: TrajectoryDisplayData;
    image: string;
}

const ModelCard: React.FunctionComponent<ModelCardProps> = (
    props: ModelCardProps
) => {
    const {
        id,
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
                <Link
                    to={{
                        pathname: "/viewer",
                        search: `?${URL_PARAM_KEY_FILE_NAME}=${id}`,
                    }}
                >
                    <img alt="example" src={props.image} />
                </Link>
            }
        >
            <div className={styles.cardText}>
                <p className={styles.simulatedTime}>{totalSimulatedTime}</p>
                <Link
                    to={{
                        pathname: "/viewer",
                        search: `?${URL_PARAM_KEY_FILE_NAME}=${id}`,
                    }}
                >
                    <p className={styles.cardTitle}>{title.toUpperCase()}</p>
                </Link>
                <p>{authors}</p>
                <a href={publication.url}>
                    <p>{publication.title}</p>
                </a>
                <p>{description}</p>
            </div>
        </Card>
    );
};

export default ModelCard;
