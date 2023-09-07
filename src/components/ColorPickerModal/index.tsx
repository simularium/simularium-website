import React, { useState } from "react";
import { Modal } from "antd";
import ColorPicker from "../ColorPicker";

import styles from "./style.css";

interface OurColorPickerProps {
    oldColor: string;
    isOpen: boolean;
    closeModal: () => void;
    agentName: string;
    tags: string[];
}

const OurColorPicker = ({
    oldColor,
    isOpen,
    closeModal,
    agentName,
    tags,
}: OurColorPickerProps) => {
    return (
        <Modal
            className={styles.modalStyle}
            open={isOpen}
            title=""
            footer={null}
            closeIcon={true}
            closable={true}
            width={225}
            onCancel={closeModal}
        >
            <ColorPicker
                agentName={agentName}
                tags={tags}
                oldColor={oldColor}
            />
        </Modal>
    );
};
export default OurColorPicker;
