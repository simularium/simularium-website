import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";
import { Exclamation } from "../Icons";

import styles from "./style.css";

interface ConversionServerErrorModalProps {
    closeModal: () => void;
}

const ConversionServerErrorModal: React.FC<ConversionServerErrorModalProps> = ({
    closeModal,
}) => {
    return (
        <CustomModal
            className={styles.serverErrorModal}
            title="File import cannot be completed"
            open
            footer={
                <Button type="primary" onClick={closeModal}>
                    OK
                </Button>
            }
            centered
            onCancel={closeModal}
        >
            <p className={styles.redText}>
                {" "}
                {Exclamation} We&apos;re sorry, the server is currently
                experiencing an issue.
            </p>
            <span>
                {" "}
                Please try again at a later time. For further assistance, please
                visit{" "}
            </span>
            <a
                href="https://forum.allencell.org/"
                target="_blank"
                rel="noreferrer"
            >
                {" "}
                The Allen Cell Discussion Forum.{" "}
            </a>
        </CustomModal>
    );
};

export default ConversionServerErrorModal;
