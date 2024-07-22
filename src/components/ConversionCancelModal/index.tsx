import { Button } from "antd";
import React from "react";
import classNames from "classnames";

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
            <Button
                className={classNames("primary-button", styles.wideButton)}
                onClick={cancelProcessing}
            >
                Yes, cancel
            </Button>
            <Button className="secondary-button" onClick={continueProcessing}>
                No
            </Button>
        </>
    );

    return (
        <CustomModal
            titleText="Cancel file import"
            footerButtons={footerButtons}
            width={426}
            closeHandler={continueProcessing}
        >
            <p>
                Information provided will not be saved. Are you sure you want to
                cancel the process?
            </p>
        </CustomModal>
    );
};

export default ConversionCancelModal;
