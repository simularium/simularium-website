import { Button } from "antd";
import React from "react";
import classNames from "classnames";

import { Exclamation } from "../Icons";
import CustomModal from "../CustomModal";

import styles from "./style.css";

interface ConversionFileSizeErrorModalProps {
    closeModal: () => void;
}

const ConversionFileSizeErrorModal: React.FC<
    ConversionFileSizeErrorModalProps
> = ({ closeModal }) => {
    const footerButton = (
        <Button className="primary-button" onClick={closeModal}>
            OK
        </Button>
    );

    return (
        <CustomModal
            titleText="File import cannot be completed"
            footerButtons={footerButton}
            closeHandler={closeModal}
        >
            <p className={classNames(styles.warningText)}>
                {Exclamation}
                {` We're sorry, there was a problem importing your file.`}
            </p>
            <p>
                {`Your file exceeds the maximum allowed size of 200 MB, please try uploading a smaller file.`}
            </p>
        </CustomModal>
    );
};

export default ConversionFileSizeErrorModal;
