import * as React from "react";
import { Card, Tag } from "antd";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { ButtonClass, TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import { CustomButton } from "../CustomButton";
import { FilledCaret } from "../Icons";

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

    const [isOpen, setIsOpen] = React.useState(false);

    const handleLoad = () => {
        window.location.href = `${VIEWER_PATHNAME}?${URL_PARAM_KEY_FILE_NAME}=${id}`;
    };

    const displayTitleIsLong = title.length + (subtitle?.length || 0) > 50;
    const caretIcon = (
        <div className={classNames(styles.caret, isOpen && styles.rotated)}>
            {FilledCaret}
        </div>
    );

    return (
        <Card
            className={classNames(styles.card, !isOpen && styles.cardClosed)}
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
                        <div className={styles.thumbnailOverlay}>
                            {version ? (
                                <Tag className={styles.versionTag}>
                                    v{version}
                                </Tag>
                            ) : (
                                // placeholder div preserves spacing when version tag is not present
                                <div></div>
                            )}
                            <span className={styles.simulatedTime}>
                                {totalSimulatedTime}
                            </span>
                        </div>
                    </div>
                </Link>
            }
        >
            <div
                className={classNames(
                    styles.trajectoryDescription,
                    displayTitleIsLong && styles.longTitle,
                    !isOpen && styles.collapsed
                )}
            >
                <p className={styles.cardTitle}>
                    {title} <span>{subtitle && `: ${subtitle}`}</span>
                </p>
                <p>{description}</p>
                {isOpen && (
                    <>
                        <div>
                            <p className={styles.publication}>{authors}</p>
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
                        </div>
                        <div>
                            {code && (
                                <p
                                    className={styles.legalese}
                                    dangerouslySetInnerHTML={{
                                        __html: code,
                                    }}
                                />
                            )}
                            {legalese && (
                                <p
                                    className={styles.legalese}
                                    dangerouslySetInnerHTML={{
                                        __html: legalese,
                                    }}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className={styles.buttons}>
                <CustomButton
                    className={styles.readMoreButton}
                    variant={ButtonClass.Action}
                    icon={caretIcon}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "SHOW LESS" : "READ MORE"}
                </CustomButton>
                <CustomButton
                    className={styles.loadButton}
                    variant={ButtonClass.DarkPrimary}
                    onClick={handleLoad}
                >
                    Load
                </CustomButton>
            </div>
        </Card>
    );
};

export default ModelCard;
