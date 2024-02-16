import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";

interface ConversionCancelModalProps {
    continueProcessing: () => void;
    cancelProcessing: () => void;
}

const ConversionCancelModal: React.FC<ConversionCancelModalProps> = ({
    continueProcessing,
    cancelProcessing,
}) => {
    const footerButtons = (
        <>
            <Button onClick={continueProcessing}>No</Button>
            <Button type="primary" onClick={cancelProcessing}>
                Yes, cancel
            </Button>
        </>
    );

    return (
        <CustomModal
            className={styles.cancelModal}
            title="Cancel file import"
            open
            footer={footerButtons}
            width={341}
            centered
            onCancel={continueProcessing}
        >
            <p>
                Information provided will not be saved. Are you sure you want to
                cancel the process?
            </p>
        </CustomModal>
    );
};

export default ConversionCancelModal;
