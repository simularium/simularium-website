import * as React from "react";

import styles from "./styles.css";
import OurColorPicker from "../ColorPickerModal";
import { useEffect, useState } from "react";
interface ColorSwatchProps {
    color: string;
    agentName: string;
    tags: string[];
}

const ColorSwatch = ({
    color,
    agentName,
    tags,
}: ColorSwatchProps): JSX.Element => {
    const [isColorPickerVisible, setColorPickerVisible] = React.useState(false);
    const [initialColor, setInitialColor] = React.useState(color); // Initial color state

    const closeModal = () => {
        setColorPickerVisible(false);
    };

    const openModal = () => {
        setInitialColor(color); // Set the initial color when about to open the modal
        setColorPickerVisible(true);
    };

    return (
        <>
            <div
                className={styles.container}
                style={{ backgroundColor: color }}
                onClick={() => {
                    openModal();
                }}
            />
            {isColorPickerVisible ? (
                <OurColorPicker
                    agentName={agentName}
                    tags={tags}
                    oldColor={initialColor}
                    isOpen={isColorPickerVisible}
                    closeModal={closeModal}
                />
            ) : null}
        </>
    );
};

export default ColorSwatch;
