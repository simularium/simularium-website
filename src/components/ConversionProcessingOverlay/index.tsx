import React, { useState } from "react";
import { Button, Divider, Spin } from "antd";
import classNames from "classnames";
import { useHistory } from "react-router";

import { IMPORT_PATHNAME } from "../../routes";
import ConversionCancelModal from "../ConversionCancelModal";
import { UpRightArrow, LeftArrow } from "../Icons";
import theme from "../../components/theme/light-theme.css";

import styles from "./style.css";

interface ConversionProcessingOverlayProps {
    fileName: string | null;
}

const ConversionProcessingOverlay = ({
    fileName,
}: ConversionProcessingOverlayProps): JSX.Element | null => {
    const [cancelModalOpen, setCancelModalOpen] = useState(false);

    const history = useHistory();

    const toggleCancelling = () => {
        setCancelModalOpen(false);
    };

    const processingOverlay = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            {cancelModalOpen ? (
                <ConversionCancelModal
                    continueProcessing={toggleCancelling}
                    cancelProcessing={() => history.push(IMPORT_PATHNAME)}
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
                    {LeftArrow} Stop and go back to form{" "}
                </a>
                <div className={styles.processingIndicator}>
                    <div className={styles.spinContainer}>
                        <Spin size={"large"}> </Spin>
                    </div>
                    <div>Processing...</div>
                </div>
                <h3>Open another instance of Simularium </h3>
                <Button
                    className={styles.button}
                    href={`https://simularium.allencell.org/viewer`}
                    target="_blank"
                >
                    Open in new tab {UpRightArrow}
                </Button>
            </div>
            <div className={styles.dividerContainer}>
                <Divider> </Divider>
            </div>
            <Button
                className={styles.button}
                onClick={() => setCancelModalOpen(true)}
            >
                Cancel file import
            </Button>
        </div>
    );

    return processingOverlay;
};

export default ConversionProcessingOverlay;
