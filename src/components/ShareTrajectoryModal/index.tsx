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

interface ShareTrajectoryModalProps {
    isLocalFile: boolean;
    closeModal: () => void;
    time: number;
    lastFrame: number;
    timeUnits: TimeUnits;
    timeStep: number;
    lastFrameTime: number;
}

const ShareTrajectoryModal = ({
    isLocalFile,
    closeModal,
    time,
    lastFrame,
    timeUnits,
    timeStep,
    lastFrameTime,
}: ShareTrajectoryModalProps): JSX.Element => {
    const [allowTimeInput, setAllowTimeInput] = React.useState(true);
    const currentTime = parseFloat(time.toFixed(2)); // slider only allows two decimal places
    const [url, setUrl] = React.useState(
        window.location.href + `?t=${currentTime}`
    );
    const [lastEnteredNumber, setLastEnteredNumber] =
        React.useState(currentTime);

    const handleAllowUserInput = (): void => {
        const value = allowTimeInput ? lastEnteredNumber : currentTime;
        setUrl(window.location.href + `?t=${value}`);
        setAllowTimeInput((allowTimeInput) => !allowTimeInput);
    };

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAsNumber = parseFloat(e.target.value);

        const timeValue = Number.isNaN(inputAsNumber) // if user has deleted their input use default time
            ? currentTime
            : inputAsNumber + timeStep >= lastFrameTime // if user entered time is greater than last frame
            ? lastFrameTime - timeStep
            : Math.round(inputAsNumber / timeStep) * timeStep; // normalize to nearest valid timestep
        setLastEnteredNumber(timeValue);
        setUrl(window.location.href + `?t=${timeValue.toFixed(4)}`); // currently truncating to four digits, this is arbitrary
    };

    const copyToClipboard = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(url);
        } catch (err) {
            console.error("Failed to copy text: ", err);
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
                              onChange={handleUserInput}
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

export default connect(mapStateToProps)(ShareTrajectoryModal);
