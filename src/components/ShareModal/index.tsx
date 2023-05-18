import React from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Divider, Input } from "antd";

import { State } from "../../state/types";
import { TimeUnits } from "../../state/trajectory/types";
import trajectoryStateBranch from "../../state/trajectory";
import selectionStateBranch from "../../state/selection";
import CustomModal from "../CustomModal";
import { Link, Warn } from "../Icons";

import styles from "./style.css";

interface ShareModalProps {
    isLocalFile: boolean;
    closeModal: () => void;
    time: number;
    lastFrame: number;
    timeUnits: TimeUnits;
    timeStep: number;
    lastFrameTime: number;
}

const ShareModal = ({
    isLocalFile,
    closeModal,
    time,
    lastFrame,
    timeUnits,
    timeStep,
    lastFrameTime,
}: ShareModalProps): JSX.Element => {
    const currentTime = parseFloat(time.toFixed(1));

    const [url, setUrl] = React.useState(
        window.location.href + `?t=${currentTime}`
    );
    const [allowTimeInput, setAllowTimeInput] = React.useState(true);

    const [lastEnteredNumber, setLastEnteredNumber] =
        React.useState(currentTime);

    // this function is attempting to normalize user input to the nearest valid timestep,
    // could confuse/frustrate users if that isn't obvious why it's happening
    // alternately we could deal with that on the backend and just pass in their input as is...
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = parseFloat(e.target.value);
        console.log("userInput: ", userInput);
        let numberValue = 0;
        if (Number.isNaN(userInput)) {
            numberValue = currentTime;
        } else if (userInput + timeStep >= lastFrameTime) {
            numberValue = lastFrameTime - timeStep;
        } else {
            numberValue = Math.round(userInput / timeStep) * timeStep;
        }
        setLastEnteredNumber(numberValue);
        setUrl(window.location.href + `?t=${numberValue}`);
    };

    const handleAllowUserInput = (): void => {
        if (allowTimeInput) {
            setUrl(window.location.href + `?t=${lastEnteredNumber}`);
            setAllowTimeInput(false);
        } else {
            setUrl(window.location.href + `?t=${currentTime}`);
            setAllowTimeInput(true);
        }
    };

    const copyToClipboard = async (): Promise<void> => {
        const inputElement = document.getElementById(
            "urlInput"
        ) as HTMLInputElement | null;
        if (inputElement) {
            try {
                // Copy the text to the clipboard
                await navigator.clipboard.writeText(inputElement.value);

                console.log("Text copied to clipboard");
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        } else {
            console.error("Element not found: ");
        }
    };

    const modalOptions = isLocalFile
        ? {
              content: (
                  <div className={styles.content}>
                      <h2 className={styles.heading}>
                          {Warn} The current file is stored on your device.
                      </h2>
                      <div className={styles.bodyText}>
                          <p>
                              To generate a shareable link, please save the file
                              in the public cloud using Dropbox, Google Drive,
                              or Amazon S3 and load the model into Simularium
                              via URL.
                              <span className={styles.blueText}>
                                  {" "}
                                  Learn more{" "}
                              </span>
                          </p>
                      </div>
                      <Divider className={styles.divider}></Divider>
                  </div>
              ),
              footer: (
                  <Button
                      className={styles.okButton}
                      type="default"
                      onClick={closeModal}
                  >
                      Ok
                  </Button>
              ),
          }
        : // if the trajectory is a networked file
          {
              content: (
                  <div className={styles.content}>
                      <div>
                          <Input
                              className={styles.urlInput}
                              id={"urlInput"}
                              value={url}
                              disabled
                          />
                          <Button type="primary" onClick={copyToClipboard}>
                              Copy {Link}
                          </Button>
                      </div>
                      <div className={styles.secondLine}>
                          {" "}
                          <Checkbox onChange={handleAllowUserInput}></Checkbox>
                          <p>Start at</p>
                          <Input
                              className={styles.numberInput}
                              disabled={allowTimeInput}
                              defaultValue={currentTime}
                              onChange={handleNumberInput}
                          />
                          <p>
                              {" "}
                              /{lastFrame} {timeUnits ? timeUnits.name : null}{" "}
                          </p>
                      </div>
                      <Divider className={styles.divider}></Divider>
                  </div>
              ),
              footer: (
                  <Button type="default" onClick={closeModal}>
                      Close
                  </Button>
              ),
          };

    return (
        <div className={styles.container}>
            <CustomModal
                className={styles.uploadModal}
                title="Share Trajectory"
                width={isLocalFile ? 611 : 550}
                onCancel={closeModal}
                mask={false}
                centered
                open
                footer={modalOptions.footer}
            >
                {modalOptions.content}
            </CustomModal>
        </div>
    );
};

function mapStateToProps(state: State) {
    return {
        time: selectionStateBranch.selectors.getCurrentTime(state),
        lastFrame:
            trajectoryStateBranch.selectors.getLastFrameTimeOfCachedSimulation(
                state
            ),
        timeUnits: trajectoryStateBranch.selectors.getTimeUnits(state),
        timeStep: trajectoryStateBranch.selectors.getTimeStep(state),
        lastFrameTime:
            trajectoryStateBranch.selectors.getLastFrameTimeOfCachedSimulation(
                state
            ),
    };
}

export default connect(mapStateToProps)(ShareModal);
