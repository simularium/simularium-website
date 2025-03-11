import * as React from "react";
import { Card, Tag } from "antd";
import { Link } from "react-router-dom";
import classNames from "classnames";

import {
    SHORT_CARD_TITLE_MAX_LENGTH,
    URL_PARAM_KEY_FILE_NAME,
} from "../../constants";
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
        softwareUsedUrl,
        inputDataUrl,
        outputDataUrl,
        thirdPartyLicensingUrl,
        imageFile,
        gifFile,
        subtitle,
    } = props.trajectory;

    const [isOpen, setIsOpen] = React.useState(false);

    const handleLoad = () => {
        window.location.href = `${VIEWER_PATHNAME}?${URL_PARAM_KEY_FILE_NAME}=${id}`;
    };

    const displayTitleIsLong =
        title.length + (subtitle?.length || 0) > SHORT_CARD_TITLE_MAX_LENGTH;
    const caretIcon = (
        <div className={classNames(styles.caret, isOpen && styles.rotated)}>
            {FilledCaret}
        </div>
    );

    const createLink = (url: string, text?: string): string => {
        return `<a href='${url}'>${text || "here"}</a>`;
    };

    const thirdPartyLicensing = (licenseUrl: string) => {
        return `${createLink(
            licenseUrl,
            "Third party licensing"
        )} requirements.`;
    };

    const softwareUsed = (
        softwareUrl?: string,
        resources?: {
            inputsUrl?: string;
            outputsUrl?: string;
        }
    ): string => {
        let description = "";

        if (softwareUrl) {
            description += `${createLink(
                softwareUrl,
                "Software used"
            )} to generate data.`;
        }

        if (resources?.inputsUrl) {
            description += ` The input data file is ${createLink(
                resources.inputsUrl
            )}.`;
        }

        if (resources?.outputsUrl) {
            description += ` The outputs that were visualized can be downloaded ${createLink(
                resources.outputsUrl
            )}.`;
        }

        return description;
    };

    const codeUrlsText = softwareUsed(softwareUsedUrl, {
        inputsUrl: inputDataUrl,
        outputsUrl: outputDataUrl,
    });

    const legaleseText = thirdPartyLicensingUrl
        ? thirdPartyLicensing(thirdPartyLicensingUrl)
        : "";

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
                            {codeUrlsText && (
                                <p
                                    className={styles.legalese}
                                    dangerouslySetInnerHTML={{
                                        __html: codeUrlsText,
                                    }}
                                />
                            )}
                            {legaleseText && (
                                <p
                                    className={styles.legalese}
                                    dangerouslySetInnerHTML={{
                                        __html: legaleseText,
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
                    {isOpen ? "READ LESS" : "READ MORE"}
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
