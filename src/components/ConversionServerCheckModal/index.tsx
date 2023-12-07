import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";
import { RoundWarning } from "../Icons";

interface ConversionServerCheckModalProps {
    closeModal: () => void;
}

const ConversionServerCheckModal: React.FC<ConversionServerCheckModalProps> = ({
    closeModal,
}) => {
    return (
        <CustomModal
            className={styles.serverCheckModal}
            title="Cancel file import"
            open
            footer={
                <Button type="primary" onClick={closeModal}>
                    Ok
                </Button>
            }
            width={425}
            centered
            onCancel={closeModal}
        >
            <div className={styles.redText}>
                {" "}
                {RoundWarning} We`&apos;`re sorry, the server is currently
                experiencing an issue.
            </div>
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

export default ConversionServerCheckModal;
