import React, { useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { ActionCreator } from "redux";
import styles from "./style.css";
import classNames from "classnames";

import selectionStateBranch from "../../state/selection";
import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import {
    ColorChangesMap,
    SetColorChangesAction,
} from "../../state/selection/types";
import { connect } from "react-redux";

interface ColorPickerProps {
    oldColor: string;
    agentName: string;
    tags: string[];
    setColorChanges: ActionCreator<SetColorChangesAction>;
}

const ColorPicker = ({
    oldColor,
    setColorChanges,
    agentName,
    tags,
}: ColorPickerProps) => {
    const [color, setColor] = useState(oldColor);

    const handleColorChange = (color: string) => {
        const colorChanges: ColorChangesMap = {
            agents: { [agentName]: tags },
            color: color,
        };
        console.log("colorChanges", colorChanges);
        console.log("setColorChanges", setColorChanges);
        setColorChanges(colorChanges);
    };

    useEffect(() => {
        handleColorChange(color);
    }, [color]);

    const recentColors = [
        "#bd7800",
        "#bbbb99",
        "#5b79f0",
        "#89a500",
        "#da8692",
        "#418463",
        "#9f516c",
        "#00aabf",
        "#94a7fc",
        "#ce8ec9",
        "#58606c",
        "#0ba345",
        "#9267cb",
        "#81dbe6",
    ];

    return (
        <div className={styles.container}>
            <HexColorPicker color={color} onChange={setColor} />
            <div className={styles.selectionDisplay}>
                <div className={styles.oldColorContainer}>
                    <div
                        className={styles.oldColor}
                        style={{ backgroundColor: oldColor }}
                        onClick={() => {
                            setColor(oldColor);
                        }}
                    >
                        {" "}
                    </div>
                    <p> CURRENT </p>
                </div>
                <div className={styles.oldColorContainer}>
                    <div
                        className={styles.newColor}
                        style={{ backgroundColor: color }}
                    >
                        {" "}
                    </div>
                    <p> NEW </p>
                </div>
                <div className={styles.oldColorContainer}>
                    <HexColorInput
                        className={styles.hexInput}
                        color={color}
                        onChange={setColor}
                    />
                    <p> HEX </p>
                </div>
            </div>
            <div
                className={classNames([
                    styles.colors,
                    styles.agentColorsSwatches,
                ])}
            >
                {AGENT_COLORS.map((color) => (
                    <button
                        key={color}
                        className={classNames([
                            styles.swatch,
                            styles.pickerSwatch,
                        ])}
                        style={{ background: color }}
                        onClick={() => setColor(color)}
                    />
                ))}
            </div>
            <p className={styles.recentColorText}> Recent </p>
            {/* TODO: only render if recent colors */}
            <div className={classNames([styles.colors, styles.recentSwatches])}>
                {recentColors.map((color) => (
                    <button
                        key={color}
                        className={classNames([
                            styles.swatch,
                            styles.recentSwatch,
                        ])}
                        style={{ background: color }}
                        onClick={() => setColor(color)}
                    />
                ))}
            </div>
        </div>
    );
};

const dispatchToPropsMap = {
    setColorChanges: selectionStateBranch.actions.setColorChanges,
};

export default connect(null, dispatchToPropsMap)(ColorPicker);
