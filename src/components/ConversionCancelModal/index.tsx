import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";

interface ConversionCancelModalProps {
    toggleCancel: () => void;
    toggleProcessing: (value: boolean) => void;
}

const ConversionCancelModal: React.FC<ConversionCancelModalProps> = ({
    toggleCancel,
    toggleProcessing,
}) => {
    const footerButtons = (
        <>
            <Button onClick={toggleCancel}>No</Button>
            <Button type="primary" onClick={() => toggleProcessing(false)}>
                Yes, cancel
            </Button>
        </>
    );

    return (
        <CustomModal
            className={styles.uploadModal}
            title="Cancel file import"
            open
            footer={footerButtons}
            width={341}
            centered
        >
            <div>
                {" "}
                Information provided will not be saved. Are you sure you want to
                cancel the process?
            </div>
        </CustomModal>
    );
};

export default ConversionCancelModal;
