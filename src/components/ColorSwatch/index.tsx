import * as React from "react";

import styles from "./styles.css";
import { useState } from "react";
import ColorPicker from "../ColorPicker";
interface ColorSwatchProps {
    childrenHaveDifferentColors?: boolean;
    color: string;
    agentName: string;
    tags: string[];
}

const ColorSwatch = ({
    childrenHaveDifferentColors,
    color,
    agentName,
    tags,
}: ColorSwatchProps): JSX.Element => {
    const [isColorPickerVisible, setColorPickerVisible] = useState(false);
    const [initialColor, setInitialColor] = useState(color);

    const closePopover = () => {
        setColorPickerVisible(false);
    };

    const openPopover = () => {
        setInitialColor(color);
        setColorPickerVisible(true);
    };

    // could move these rules into the css sheet, but to get color from prop
    // and apply rules conditionlly means there will be some inline styling
    // figured its more clean to have it all visible here rather than some here and some in stylesheet
    const style = childrenHaveDifferentColors
        ? { border: "1px solid #d3d3d3" }
        : { backgroundColor: color };

    return (
        <>
            <div
                className={styles.container}
                style={style}
                onClick={openPopover}
            />
            {isColorPickerVisible ? (
                <ColorPicker
                    agentName={agentName}
                    tags={tags}
                    initialColor={initialColor}
                    isOpen={isColorPickerVisible}
                    closePopover={closePopover}
                />
            ) : null}
        </>
    );
};

export default ColorSwatch;
