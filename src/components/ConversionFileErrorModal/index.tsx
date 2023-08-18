import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";
import { Exclamation } from "../Icons";

interface ConversionFileErrorModalProps {
    closeModal: () => void;
}

const ConversionFileErrorModal: React.FC<ConversionFileErrorModalProps> = ({
    closeModal,
}) => {
    const footerButtons = (
        <>
            <Button type="primary" onClick={closeModal}>
                Ok
            </Button>
        </>
    );

    return (
        <CustomModal
            className={styles.errorModal}
            title="File import cannot be completed"
            open
            footer={footerButtons}
            width={425}
            centered
            onCancel={closeModal}
        >
            <div>
                <div className={styles.redText}>
                    {" "}
                    {Exclamation}{" "}
                    {`We're sorry, there was a problem importing your file.`}
                </div>{" "}
                You may want to double check that the file you selected is a
                Smoldyn file and try again. For further assistance, please visit
                <a href="https://forum.allencell.org/">
                    {" "}
                    The Allen Cell Discussion Forum.{" "}
                </a>
            </div>
        </CustomModal>
    );
};

export default ConversionFileErrorModal;
