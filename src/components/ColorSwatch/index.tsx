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
    const [newColor, setNewColor] = useState(color);

    const closeModal = () => {
        setColorPickerVisible(false);
    };

    return (
        <>
            <div
                className={styles.container}
                style={{ backgroundColor: newColor }}
                onClick={() => {
                    setColorPickerVisible(true);
                }}
            />
            {isColorPickerVisible ? (
                <OurColorPicker
                    agentName={agentName}
                    tags={tags}
                    oldColor={color}
                    isOpen={isColorPickerVisible}
                    closeModal={closeModal}
                />
            ) : null}
        </>
    );
};

export default ColorSwatch;
