import * as React from "react";
import { Card, Tag } from "antd";
import { Link } from "react-router-dom";

import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";

import styles from "./style.css";

interface ModelCardProps {
    trajectory: TrajectoryDisplayData;
}

const ModelCard: React.FunctionComponent<ModelCardProps> = (
    props: ModelCardProps
): JSX.Element => {
    const {
        id,
        title,
        totalSimulatedTime,
        version,
        authors,
        publication,
        description,
        code,
        legalese,
        imageFile,
        gifFile,
        subtitle,
    } = props.trajectory;
    return (
        <Card
            className={styles.card}
            cover={
                <Link
                    to={{
                        pathname: VIEWER_PATHNAME,
                        search: `?${URL_PARAM_KEY_FILE_NAME}=${id}`,
                    }}
                >
                    {/* Static image turns into animated gif on hover */}
                    <div className={styles.thumbnail}>
                        <img
                            className={styles.staticThumbnail}
                            alt={`Snapshot of simulation for ${title}`}
                            src={imageFile}
                        />
                        <img
                            className={styles.animatedThumbnail}
                            alt={`Snapshot of simulation for ${title}`}
                            src={gifFile}
                        />
                    </div>
                </Link>
            }
        >
            <div className={styles.trajectoryDescription}>
                <div className={styles.versionAndTime}>
                    {version ? (
                        <Tag className={styles.versionTag}>v{version}</Tag>
                    ) : (
                        <div />
                    )}
                    <span className={styles.simulatedTime}>
                        {totalSimulatedTime}
                    </span>
                </div>
                <Link
                    to={{
                        pathname: VIEWER_PATHNAME,
                        search: `?${URL_PARAM_KEY_FILE_NAME}=${id}`,
                    }}
                >
                    <p className={styles.cardTitle}>
                        {/*
                        First line is {title}, and second line is optional {subTitle},
                        with a colon after title if subTitle exists, e.g.,
                        Actin-based Listeria Propulsion:
                        Normal ActA Distribution 
                        */}
                        {title}
                        {subtitle && (
                            <span>
                                :<br />
                                {subtitle}
                            </span>
                        )}
                    </p>
                </Link>
                <p>{authors}</p>
                <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <p className={styles.publication}>
                        {publication.title}.{" "}
                        <span className={styles.journal}>
                            {publication.journal}{" "}
                        </span>
                        ({publication.year})
                    </p>
                </a>
                <p>{description}</p>
                {code && <p dangerouslySetInnerHTML={{ __html: code }} />}
            </div>
            <div className={styles.stretch} />
            <div>
                {legalese && (
                    <p
                        className={styles.legalese}
                        dangerouslySetInnerHTML={{ __html: legalese }}
                    />
                )}
            </div>
        </Card>
    );
};

export default ModelCard;
