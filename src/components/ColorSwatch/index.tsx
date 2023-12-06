import React, { useState } from "react";
import { ActionCreator } from "redux";

import ColorPicker from "../ColorPicker";
import {
    SetColorChangeAction,
    SetRecentColorsAction,
} from "../../state/selection/types";
import styles from "./styles.css";
interface ColorSwatchProps {
    childrenHaveDifferentColors?: boolean;
    color: string;
    agentName: string;
    tags: string[];
    recentColors: string[];
    setColorChange: ActionCreator<SetColorChangeAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

const ColorSwatch = ({
    childrenHaveDifferentColors,
    color,
    agentName,
    tags,
    recentColors,
    setColorChange,
    setRecentColors,
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
    // and apply rules conditionally means there will be some inline styling
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
            <ColorPicker
                agentName={agentName}
                tags={tags}
                initialColor={initialColor}
                isOpen={isColorPickerVisible}
                closePopover={closePopover}
                recentColors={recentColors}
                setColorChange={setColorChange}
                setRecentColors={setRecentColors}
            />
        </>
    );
};

export default ColorSwatch;
