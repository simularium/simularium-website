import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";
import { RoundWarning } from "../Icons";

interface ConversionServerCheckModalProps {
    closeModal: () => void;
}

/////PSEUDOCODE OF APPROACH/////
// viewer will have a method that sends a websocket request with server health check id
// if healthy receive message from websocket with server health check id
// store response or lack of response in redux

// when sim controller gets instatiated it will call configure network which will call create simulator connection
// i should add to create simulator connection a health check call
// simulariumController.sendServerHealthCheck()

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
                {RoundWarning} We're sorry, the server is currently experiencing
                an issue.
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
