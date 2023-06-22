import React, { useState } from "react";
import { Button, Divider, Spin } from "antd";

import { UpRightArrow, LeftArrow } from "../Icons";

import styles from "./style.css";
import ConversionCancelModal from "../ConversionCancelModal";

interface ConversionProcessingOverlayProps {
    toggleProcessing: () => void;
    fileName: string | null;
}

const ConversionProcessingOverlay = ({
    toggleProcessing,
    fileName,
}: ConversionProcessingOverlayProps): JSX.Element | null => {
    const [cancelModalOpen, setCancelModalOpen] = useState(false);

    const toggleCancelling = () => {
        setCancelModalOpen(false);
    };

    const processingOverlay = (
        <div className={styles.container}>
            {cancelModalOpen ? (
                <ConversionCancelModal
                    continueProcessing={toggleCancelling}
                    cancelProcessing={toggleProcessing}
                />
            ) : null}
            <h2 className={styles.titleText}> File conversion in progress </h2>
            <p className={styles.centerText}>
                {" "}
                {fileName} is being converted and will load when complete.{" "}
                <br></br>
                Processing time will vary depending on file size.
            </p>
            <a
                className={styles.goBackButton}
                onClick={() => setCancelModalOpen(true)}
            >
                {" "}
                {LeftArrow} Stop and go back to form{" "}
            </a>
            <div className={styles.spin}>
                <Spin size={"large"}> </Spin>
            </div>
            <p className={styles.processingMargin}> Processing... </p>
            <h3 className={styles.mediumText}>
                {" "}
                Open another instance of Simularium{" "}
            </h3>
            <Button
                className={styles.tabButton}
                href={`https://simularium.allencell.org/viewer`}
                target="_blank"
            >
                Open in new tab {UpRightArrow}
            </Button>
            <div className={styles.dividerContainer}>
                <Divider> </Divider>
            </div>
            <Button
                className={styles.cancelButton}
                onClick={() => setCancelModalOpen(true)}
            >
                Cancel file import
            </Button>
        </div>
    );

    return processingOverlay;
};

export default ConversionProcessingOverlay;
