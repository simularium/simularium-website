import React from "react";

import styles from "./style.css";

interface ViewerOverlayTargetProps {
    title: string;
}

const EmbedOverlay = ({
    title,
}: ViewerOverlayTargetProps): JSX.Element | null => {
    return (
        <div className={styles.container}>
            <h4>{title}</h4>
        </div>
    );
};

export default EmbedOverlay;
