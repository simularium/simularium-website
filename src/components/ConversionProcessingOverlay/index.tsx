import React, { useState } from "react";
import { Divider, Spin } from "antd";

import { ButtonClass } from "../../constants/interfaces";
import ConversionCancelModal from "../ConversionCancelModal";
import { CustomButton } from "../CustomButton";
import { UpRightArrow, GoBack } from "../Icons";

import styles from "./style.css";

interface ConversionProcessingOverlayProps {
    fileName: string | null;
    cancelProcessing: () => void;
}

const ConversionProcessingOverlay = ({
    fileName,
    cancelProcessing,
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
                    cancelProcessing={cancelProcessing}
                />
            ) : null}
            <h2 className={styles.title}> File conversion in progress </h2>
            <div className={styles.content}>
                {" "}
                {fileName} is being converted and will load when complete.{" "}
                <br></br>
                Processing time will vary depending on file size.
                <a
                    className={styles.goBackButton}
                    onClick={() => setCancelModalOpen(true)}
                >
                    {" "}
                    {GoBack} Stop and go back to form{" "}
                </a>
                <div className={styles.processingIndicator}>
                    <div className={styles.spinContainer}>
                        <Spin size={"large"}> </Spin>
                    </div>
                    <div>Processing...</div>
                </div>
                <h3 className={styles.newInstanceText}>
                    Open another instance of Simularium{" "}
                </h3>
                <CustomButton
                    variant={ButtonClass.LightSecondary}
                    href={`https://simularium.allencell.org/viewer`}
                    target="_blank"
                >
                    Open in new tab {UpRightArrow}
                </CustomButton>
            </div>
            <div className={styles.dividerContainer}>
                <Divider> </Divider>
            </div>
            <CustomButton
                variant={ButtonClass.LightSecondary}
                onClick={() => setCancelModalOpen(true)}
            >
                Cancel file import
            </CustomButton>
        </div>
    );

    return processingOverlay;
};

export default ConversionProcessingOverlay;
