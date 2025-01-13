import { CustomButton } from "../CustomButton";
import React from "react";

import { ButtonClass } from "../../constants/interfaces";
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
            <CustomButton
                variant={ButtonClass.LightPrimary}
                className={styles.wideButton}
                onClick={cancelProcessing}
            >
                Yes, cancel
            </CustomButton>
            <CustomButton
                variant={ButtonClass.LightSecondary}
                onClick={continueProcessing}
            >
                No
            </CustomButton>
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
