import React from "react";
import CustomModal from "../CustomModal";

import styles from "./style.css";

interface EmbedPreviewProps {
    embedSnippet: string;
    height: number;
    width: number;
    preview: boolean;
    setPreview: (value: boolean) => void;
}

const EmbedPreview: React.FC<EmbedPreviewProps> = ({
    embedSnippet,
    height,
    width,
    preview,
    setPreview,
}) => {
    document.documentElement.style.setProperty(
        "--embed-preview-modal-width",
        `${width + 50}px`
    );
    document.documentElement.style.setProperty(
        "--embed-preview-modal-height",
        `${height + 112}px`
    );

    return (
        <CustomModal
            closeHandler={() => {
                setPreview(!preview);
            }}
            titleText="Preview"
            className={styles.embedPreviewModal}
        >
            <div dangerouslySetInnerHTML={{ __html: embedSnippet }} />
        </CustomModal>
    );
};

export default EmbedPreview;
