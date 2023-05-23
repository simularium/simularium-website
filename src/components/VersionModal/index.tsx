import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";

interface VersionModalProps {
    setModalVisible: (isModalVisible: boolean) => void;
}

const VersionModal: React.FC<VersionModalProps> = ({ setModalVisible }) => {
    const closeModal = () => {
        setModalVisible(false);
    };

    const footerButton = (
        <>
            <Button type="primary" onClick={closeModal}>
                Close
            </Button>
        </>
    );
    console.log("VersionModal");
    return (
        <CustomModal
            className={styles.container}
            onCancel={closeModal}
            open
            footer={footerButton}
            centered
            title="Version Info"
            width={425}
        >
            <div>
                {" "}
                Application:{" "}
                <span className={styles.blueText}>
                    {" "}
                    simularium-website v{SIMULARIUM_WEBSITE_VERSION}{" "}
                </span>
            </div>
            <div>
                {" "}
                Viewer:{" "}
                <span className={styles.blueText}>
                    {" "}
                    simulairum-viewer v{SIMULARIUM_VIEWER_VERSION}{" "}
                </span>
            </div>
            {/* TODO what should this content be */}
            <span> Engine: not connected to server </span>
        </CustomModal>
    );
};

export default VersionModal;
