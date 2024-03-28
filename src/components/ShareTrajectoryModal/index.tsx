import React from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Divider, Input } from "antd";

import { State } from "../../state/types";
import { TimeUnits } from "../../state/trajectory/types";
import trajectoryStateBranch from "../../state/trajectory";
import { getDisplayTimes } from "../../containers/ViewerPanel/selectors";
import { DisplayTimes } from "../../containers/ViewerPanel/types";
import CustomModal from "../CustomModal";
import { Link, Warn } from "../Icons";
import { URL_PARAM_KEY_TIME } from "../../constants";
import { editUrlParams } from "../../util";

import styles from "./style.css";

interface ShareTrajectoryModalProps {
    trajectoryIsSharable: boolean;
    closeModal: () => void;
    timeUnits: TimeUnits;
    displayTimes: DisplayTimes;
}

const ShareTrajectoryModal = ({
    trajectoryIsSharable,
    closeModal,
    timeUnits,
    displayTimes,
}: ShareTrajectoryModalProps): JSX.Element => {
    const currentTime = roundToTimestepPrecision(
        displayTimes.roundedTime,
        displayTimes.roundedTimeStep
    );

    const [allowTimeInput, setAllowTimeInput] = React.useState(true);
    const [url, setUrl] = React.useState(
        editUrlParams(
            window.location.href,
            currentTime.toString(),
            URL_PARAM_KEY_TIME
        )
    );
    const [lastEnteredNumber, setLastEnteredNumber] =
        React.useState(currentTime);

    const handleAllowUserInput = (): void => {
        const timeValue = allowTimeInput ? lastEnteredNumber : currentTime;
        setUrl(
            editUrlParams(
                window.location.href,
                timeValue.toString(),
                URL_PARAM_KEY_TIME
            )
        );
        setAllowTimeInput((allowTimeInput) => !allowTimeInput);
    };

    function roundToTimestepPrecision(input: number, timestep: number): number {
        const precision = (timestep.toString().split(".")[1] || "").length;
        const multiplier = Math.pow(10, precision);
        return Math.round(input * multiplier) / multiplier;
    }

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setUrl(
            editUrlParams(
                window.location.href,
                timeValue.toString(),
                URL_PARAM_KEY_TIME
            )
        );
    };

    const copyToClipboard = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(url);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const modalOptions = {
        errorMessage: {
            content: (
                <>
                    <h4>{Warn} The current file is stored on your device.</h4>
                    <div className={styles.bodyText}>
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
                                {" "}
                                Learn more{" "}
                            </a>
                        </h5>
                    </div>
                </>
            ),
            footer: (
                <Button className={"secondary-button"} onClick={closeModal}>
                    Ok
                </Button>
            ),
        },
        isSharable: {
            content: (
                <>
                    <div>
                        <Input
                            className={styles.urlInput}
                            value={url}
                            disabled
                        />
                        <Button
                            className={"primary-button"}
                            onClick={copyToClipboard}
                        >
                            Copy {Link}
                        </Button>
                    </div>
                    <div className={styles.timeInputContainer}>
                        <Checkbox onChange={handleAllowUserInput}></Checkbox>
                        <p className={styles.timeInputText}>Start at</p>
                        <Input
                            className={styles.timeInput}
                            disabled={allowTimeInput}
                            defaultValue={currentTime}
                            onChange={handleUserInput}
                        />
                        <div>
                            /{displayTimes.roundedLastFrameTime}
                            {timeUnits ? timeUnits.name : null}
                        </div>
                    </div>
                </>
            ),
            footer: (
                <Button className="secondary-button" onClick={closeModal}>
                    Close
                </Button>
            ),
        },
    };

    return (
        <CustomModal
            className={styles.uploadModal}
            title="Share Trajectory"
            width={trajectoryIsSharable ? 550 : 611}
            onCancel={closeModal}
            centered
            open
            footer={
                trajectoryIsSharable
                    ? modalOptions.isSharable.footer
                    : modalOptions.errorMessage.footer
            }
        >
            {trajectoryIsSharable
                ? modalOptions.isSharable.content
                : modalOptions.errorMessage.content}
            <Divider />
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
