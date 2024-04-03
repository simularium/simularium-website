import React from "react";
import { Button } from "antd";

import CustomModal from "../CustomModal";
import { Exclamation } from "../Icons";

import styles from "./style.css";

interface ConversionServerErrorModalProps {
    closeModal: () => void;
}

const ConversionServerErrorModal: React.FC<ConversionServerErrorModalProps> = ({
    closeModal,
}) => {
    const footerButtons = (
        <Button className="primary-button" onClick={closeModal}>
            OK
        </Button>
    );

    return (
        <CustomModal
            className={styles.serverErrorModal}
            titleText="File import cannot be completed"
            footerButtons={footerButtons}
            closeHandler={closeModal}
        >
            <p className={styles.warningText}>
                {Exclamation}{" "}
                {` We're sorry, the server is currently
                experiencing an issue.`}
            </p>
            <p>
                {`Please try again at a later time. For further assistance, please
                visit `}
                <a
                    href="https://forum.allencell.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    The Allen Cell Discussion Forum.
                </a>
            </p>
        </CustomModal>
    );
};

export default ConversionServerErrorModal;
