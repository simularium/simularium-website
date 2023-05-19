import React from "react";
import { Button, Divider, Spin } from "antd";

import { UpRightArrow, LeftArrow } from "../Icons";

import styles from "./style.css";

interface ConversionProcessingOverlayProps {
    toggleProcessing: (value: boolean) => void;
    fileName: string | null;
}

const ConversionProcessingOverlay = ({
    toggleProcessing,
    fileName,
}: ConversionProcessingOverlayProps): JSX.Element | null => {
    const cancelImport = () => {
        // this should send necessary information to the backend to cancel the import
        toggleProcessing(false);
    };

    const processingOverlay = (
        <div className={styles.container}>
            <h2 className={styles.titleText}> File conversion in progress </h2>
            <p className={styles.centerText}>
                {" "}
                {fileName} is being converted and will load when complete.{" "}
                <br></br>
                <p>Processing time will vary depending on file size.</p>
            </p>
            <p className={styles.goBackButton} onClick={cancelImport}>
                {" "}
                {LeftArrow} Stop and go back to form{" "}
            </p>
            <div className={styles.spin}>
                <Spin size={"large"}> </Spin>
            </div>
            <p className={styles.processingMargin}> Processing... </p>
            <p> </p>
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
            <Button className={styles.cancelButton} onClick={cancelImport}>
                Cancel file import
            </Button>
        </div>
    );

    return processingOverlay;
};

export default ConversionProcessingOverlay;
