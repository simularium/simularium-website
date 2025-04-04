import React, { useEffect, useState } from "react";
import { Cancel } from "../Icons";

import styles from "./style.css";

const FADE_DURATION_MS = 2000;

const SmallScreenWarning = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            triggerFade();
        }, FADE_DURATION_MS);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const triggerFade = () => {
        if (!isFading) {
            setIsFading(true);
            setTimeout(() => {
                setIsVisible(false);
            }, FADE_DURATION_MS);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`${styles.warningContainer} ${
                isFading ? styles.fadeOut : ""
            }`}
        >
            <div className={styles.warningContent}>
                <div>
                    Tip: Simularium is experienced best on a larger screen size.
                </div>
                <button
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Close Warning"
                >
                    {Cancel}
                </button>
            </div>
        </div>
    );
};

export default SmallScreenWarning;
