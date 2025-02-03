import React from "react";
import { connect } from "react-redux";
import { Input, Radio, RadioChangeEvent, Space } from "antd";
import classNames from "classnames";

import { State } from "../../state/types";
import { TimeUnits } from "../../state/trajectory/types";
import trajectoryStateBranch from "../../state/trajectory";
import { getDisplayTimes } from "../../containers/ViewerPanel/selectors";
import { DisplayTimes } from "../../containers/ViewerPanel/types";
import CustomModal from "../CustomModal";
import { Link, Warn } from "../Icons";
import { URL_PARAM_KEY_TIME } from "../../constants";
import { ButtonClass } from "../../constants/interfaces";
import { copyToClipboard, roundToTimeStepPrecision } from "../../util";
import { editUrlParams } from "../../util/userUrlHandling";
import { HorizontalFlexbox, VerticalFlexbox } from "../FlexboxUtility";
import { CustomButton } from "../CustomButton";
import EmbedSnippetPanel from "./EmbedSnippetPanel";

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
    enum TimeToUse {
        BEGINNING = "beginning",
        USER_ENTERED = "user-entered",
    }
    const [startTimeToUse, setStartTimeToUse] = React.useState(
        TimeToUse.BEGINNING
    );
    const currentTime = roundToTimeStepPrecision(
        displayTimes.roundedTime,
        displayTimes.roundedTimeStep
    );

    const [userEnteredTime, setUserEnteredTime] = React.useState(currentTime);

    const startTime =
        startTimeToUse === TimeToUse.BEGINNING ? 0 : userEnteredTime;
    const linkUrl = editUrlParams(
        window.location.href,
        startTime.toString(),
        URL_PARAM_KEY_TIME
    );

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
            // set time to last frame time
            timeValue =
                displayTimes.roundedLastFrameTime -
                displayTimes.roundedTimeStep;
        } else {
            timeValue = roundToTimeStepPrecision(
                inputAsNumber,
                displayTimes.roundedTimeStep
            );
        }
        setUserEnteredTime(timeValue);
    };

    const UrlLinkPanel: JSX.Element = (
        <>
            <VerticalFlexbox gap={2}>
                <Radio.Group
                    className={styles.customRadioGroup}
                    value={startTimeToUse}
                    onChange={(e: RadioChangeEvent) => {
                        setStartTimeToUse(e.target.value);
                    }}
                >
                    <Space direction="vertical">
                        <Radio value={TimeToUse.BEGINNING}>
                            From beginning
                        </Radio>
                        <Radio value={TimeToUse.USER_ENTERED}>
                            Start at{" "}
                            <Input
                                className={classNames(styles.timeInput, {
                                    [styles.disabled]:
                                        startTimeToUse === TimeToUse.BEGINNING,
                                })}
                                defaultValue={currentTime}
                                onChange={handleTimeInput}
                                value={userEnteredTime}
                                onClick={() => {
                                    setStartTimeToUse(TimeToUse.USER_ENTERED);
                                }}
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
                <HorizontalFlexbox gap={6}>
                    <Input
                        className={styles.urlInput}
                        value={linkUrl}
                        disabled
                    />
                    <CustomButton
                        variant={ButtonClass.LightPrimary}
                        onClick={() => copyToClipboard(linkUrl)}
                    >
                        Copy
                    </CustomButton>
                </HorizontalFlexbox>
            </VerticalFlexbox>
        </>
    );

    /** Rendering options for local/networked files */
    const modalOptions = {
        errorMessage: {
            content: (
                <div>
                    <h5 className={styles.localFileHeading}>
                        {Warn} The current file is stored on your device.
                    </h5>
                    <div className={styles.localFileMessage}>
                        <p>
                            To generate a shareable link, please save the file
                            in the public cloud using Dropbox, Google Drive, or
                            Amazon S3 and load the model into Simularium via
                            URL.{" "}
                            <a
                                href="https://simularium.allencell.org/tutorial#share-a-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Learn more
                            </a>
                        </p>
                    </div>
                </div>
            ),
            footer: (
                <CustomButton
                    variant={ButtonClass.LightSecondary}
                    onClick={closeModal}
                >
                    Ok
                </CustomButton>
            ),
        },
        isShareable: {
            content: (
                <VerticalFlexbox gap={30} className={styles.shareContainer}>
                    {UrlLinkPanel}
                    <EmbedSnippetPanel startTime={startTime} />
                </VerticalFlexbox>
            ),
            footer: (
                <CustomButton
                    variant={ButtonClass.LightSecondary}
                    onClick={closeModal}
                >
                    Done
                </CustomButton>
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
