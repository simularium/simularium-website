import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Input, Radio, RadioChangeEvent, Space } from "antd";

import { State } from "../../state/types";
import { TimeUnits } from "../../state/trajectory/types";
import trajectoryStateBranch from "../../state/trajectory";
import { getDisplayTimes } from "../../containers/ViewerPanel/selectors";
import { DisplayTimes } from "../../containers/ViewerPanel/types";
import CustomModal from "../CustomModal";
import { DownArrow, Link, Warn } from "../Icons";
import { URL_PARAM_KEY_FILE_NAME, URL_PARAM_KEY_TIME } from "../../constants";
import { ButtonClass } from "../../constants/interfaces";
import { copyToClipboard, editUrlParams, getUrlParamValue } from "../../util";
import VerticalFlexbox from "../../styles/utils";

import styles from "./style.css";

interface ShareTrajectoryModalProps {
    trajectoryIsShareable: boolean;
    closeModal: () => void;
    timeUnits: TimeUnits;
    displayTimes: DisplayTimes;
}

const ShareTrajectoryModal = ({
    trajectoryIsShareable,
    closeModal,
    timeUnits,
    displayTimes,
}: ShareTrajectoryModalProps): JSX.Element => {
    /** URL Link Section */
    const roundToTimestepPrecision = (
        input: number,
        timestep: number
    ): number => {
        const precision = (timestep.toString().split(".")[1] || "").length;
        const multiplier = Math.pow(10, precision);
        return Math.round(input * multiplier) / multiplier;
    };

    const handleAllowTimeInput = (): void => {
        const timeValue = allowTimeInput ? lastEnteredNumber : currentTime;
        setLinkUrl(
            editUrlParams(
                window.location.href,
                timeValue.toString(),
                URL_PARAM_KEY_TIME
            )
        );
        setAllowTimeInput((allowTimeInput) => !allowTimeInput);
    };

    const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAsNumber = parseFloat(e.target.value);
        let timeValue = null;
        if (Number.isNaN(inputAsNumber)) {
            // if user has deleted their input use default time
            timeValue = currentTime;
        } else if (
            // if user entered time is greater than last frame time
            inputAsNumber + displayTimes.roundedTimeStep >=
            displayTimes.roundedLastFrameTime
        ) {
            timeValue =
                displayTimes.roundedLastFrameTime -
                displayTimes.roundedTimeStep;
        } else {
            timeValue = roundToTimestepPrecision(
                inputAsNumber,
                displayTimes.roundedTimeStep
            );
        }
        setLastEnteredNumber(timeValue);
        setLinkUrl(
            editUrlParams(
                window.location.href,
                timeValue.toString(),
                URL_PARAM_KEY_TIME
            )
        );
    };

    const [timeRadioGroupValue, setTimeRadioGroupValue] = React.useState(1);
    const [allowTimeInput, setAllowTimeInput] = React.useState(true);
    const currentTime = roundToTimestepPrecision(
        displayTimes.roundedTime,
        displayTimes.roundedTimeStep
    );
    const [linkUrl, setLinkUrl] = React.useState(
        editUrlParams(
            window.location.href,
            currentTime.toString(),
            URL_PARAM_KEY_TIME
        )
    );
    const [lastEnteredNumber, setLastEnteredNumber] =
        React.useState(currentTime);
    const onRadioChange = (e: RadioChangeEvent) => {
        setTimeRadioGroupValue(e.target.value);
        handleAllowTimeInput();
    };

    const UrlLinkPanel: JSX.Element = (
        <>
            <VerticalFlexbox gap={2}>
                <Radio.Group
                    className={styles.customRadioGroup}
                    value={timeRadioGroupValue}
                    onChange={onRadioChange}
                >
                    <Space direction="vertical">
                        <Radio value={1}>From beginning</Radio>
                        <Radio value={2}>
                            Start at{" "}
                            <Input
                                className={styles.timeInput}
                                disabled={allowTimeInput}
                                defaultValue={currentTime}
                                onChange={handleTimeInput}
                            />
                            <div>
                                /{displayTimes.roundedLastFrameTime}
                                {timeUnits ? timeUnits.name : null}
                            </div>{" "}
                        </Radio>
                    </Space>
                </Radio.Group>
            </VerticalFlexbox>
            <VerticalFlexbox gap={10}>
                <h4> Copy link {Link} </h4>
                <div className={styles.urlInputContainer}>
                    <Input
                        className={styles.urlInput}
                        value={linkUrl}
                        disabled
                    />
                    <Button
                        className={"primary-button"}
                        onClick={() => copyToClipboard(linkUrl)}
                    >
                        Copy
                    </Button>
                </div>
            </VerticalFlexbox>
        </>
    );

    /** Embedded Snippet */
    interface EmbedSettings {
        width: number;
        height: number;
        userProvidedProportions: boolean;
    }

    const defaultEmbedSettings: EmbedSettings = {
        width: 834,
        height: 480,
        userProvidedProportions: false,
    };

    const trajectory = getUrlParamValue(
        window.location.href,
        URL_PARAM_KEY_FILE_NAME
    );
    const [embedSettings, setEmbedSettings] =
        React.useState(defaultEmbedSettings);
    const [showEmbedSettingsPanel, setShowEmbedSettingsPanel] =
        React.useState(false);

    const generateEmbedSnippet = (): string => {
        const { width, height } = embedSettings;

        const snippetHeight =
            embedSettings.userProvidedProportions && embedSettings.height
                ? height
                : defaultEmbedSettings.height;
        const snippetWidth =
            embedSettings.userProvidedProportions && embedSettings.width
                ? width
                : defaultEmbedSettings.width;
        const url = `https://simularium.allencell.org/embed?trajFileName=${trajectory}&t=0`;
        return `<iframe height="${snippetHeight}" width="${snippetWidth} "src="${url}" title="Simularium" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    };

    const [embedSnippet, setEmbedSnippet] = React.useState(
        generateEmbedSnippet()
    );

    useEffect(() => {
        setEmbedSnippet(generateEmbedSnippet());
    }, [embedSettings]);

    const handleEmbeddedSizeInputs = (
        setting: "height" | "width",
        input: string
    ) => {
        const numericInput = input ? parseInt(input) : 0;
        let roundedLimitedInput;

        if (setting === "width") {
            roundedLimitedInput = numericInput >= 3840 ? 3840 : numericInput;
        } else if (setting === "height") {
            roundedLimitedInput = numericInput >= 2160 ? 2160 : numericInput;
        }

        setEmbedSettings({ ...embedSettings, [setting]: roundedLimitedInput });
    };

    const EmbedSnippetPanel: JSX.Element = (
        <VerticalFlexbox gap={8}>
            <div className={styles.embedHeader}>
                <h4>Embed &lt;/&gt;</h4>
                <button
                    className={styles.settingsButton}
                    onClick={() => {
                        setShowEmbedSettingsPanel(!showEmbedSettingsPanel);
                    }}
                >
                    Show settings {DownArrow}
                </button>
            </div>
            {showEmbedSettingsPanel && (
                <div className={styles.embedSettings}>
                    <VerticalFlexbox gap={4}>
                        <p className={styles.accentText}> Size </p>
                        <VerticalFlexbox gap={24}>
                            <div className={styles.proportionSettings}>
                                {" "}
                                <Input
                                    disabled={
                                        !embedSettings.userProvidedProportions
                                    }
                                    defaultValue={embedSettings.height}
                                    className={styles.numberInputs}
                                    onChange={(e) => {
                                        handleEmbeddedSizeInputs(
                                            "height",
                                            e.target.value
                                        );
                                    }}
                                />
                                <p> x </p>
                                <Input
                                    disabled={
                                        !embedSettings.userProvidedProportions
                                    }
                                    value={embedSettings.width}
                                    className={styles.numberInputs}
                                    onChange={(e) => {
                                        handleEmbeddedSizeInputs(
                                            "width",
                                            e.target.value
                                        );
                                    }}
                                />
                                <p> pixels </p>
                                <div className={styles.constrainProportions}>
                                    <Checkbox
                                        onChange={() => {
                                            setEmbedSettings({
                                                ...embedSettings,
                                                ["userProvidedProportions"]:
                                                    !embedSettings.userProvidedProportions,
                                            });
                                        }}
                                    ></Checkbox>
                                    <p>Constrain proportions</p>
                                </div>
                            </div>
                        </VerticalFlexbox>
                    </VerticalFlexbox>
                </div>
            )}
            <VerticalFlexbox gap={8} alignItems="end">
                <Input.TextArea
                    className={styles.embedInput}
                    value={embedSnippet}
                    disabled
                />
                <Button
                    className={"primary-button"}
                    onClick={() => copyToClipboard(embedSnippet)}
                >
                    Copy
                </Button>
            </VerticalFlexbox>
        </VerticalFlexbox>
    );

    /** Rendering options for local/networked files */
    const modalOptions = {
        errorMessage: {
            content: (
                <div>
                    <h4>{Warn} The current file is stored on your device.</h4>
                    <div>
                        <h5>
                            To generate a shareable link, please save the file
                            in the public cloud using Dropbox, Google Drive, or
                            Amazon S3 and load the model into Simularium via
                            URL.
                            <a
                                href="https://simularium.allencell.org/tutorial#share-a-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Learn more
                            </a>
                        </h5>
                    </div>
                </div>
            ),
            footer: (
                <Button className={"secondary-button"} onClick={closeModal}>
                    Ok
                </Button>
            ),
        },
        isShareable: {
            content: (
                <VerticalFlexbox gap={30} className={styles.shareContainer}>
                    {UrlLinkPanel}
                    {EmbedSnippetPanel}
                </VerticalFlexbox>
            ),
            footer: (
                <Button className={ButtonClass.Secondary} onClick={closeModal}>
                    Done
                </Button>
            ),
        },
    };

    return (
        <CustomModal
            closeHandler={closeModal}
            titleText="Share trajectory"
            width={trajectoryIsShareable ? 550 : 611}
            footerButtons={
                trajectoryIsShareable
                    ? modalOptions.isShareable.footer
                    : modalOptions.errorMessage.footer
            }
        >
            {trajectoryIsShareable
                ? modalOptions.isShareable.content
                : modalOptions.errorMessage.content}
        </CustomModal>
    );
};

function mapStateToProps(state: State) {
    return {
        timeUnits: trajectoryStateBranch.selectors.getTimeUnits(state),
        displayTimes: getDisplayTimes(state),
    };
}

export default connect(mapStateToProps)(ShareTrajectoryModal);
