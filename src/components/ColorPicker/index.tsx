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
    SetRecentColorsAction,
} from "../../state/selection/types";
import { connect } from "react-redux";

interface ColorPickerProps {
    oldColor: string;
    agentName: string;
    tags: string[];
    setColorChanges: ActionCreator<SetColorChangesAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
    recentColors: string[];
}

const ColorPicker = ({
    oldColor,
    setColorChanges,
    agentName,
    tags,
    recentColors,
    setRecentColors,
}: ColorPickerProps) => {
    const [color, setColor] = useState(oldColor);

    const handleColorChange = (color: string) => {
        const colorChanges: ColorChangesMap = {
            agents: { [agentName]: tags },
            color: color,
        };
        setColorChanges(colorChanges);
        updateRecentColors(color);
    };

    useEffect(() => {
        handleColorChange(color);
    }, [color]);

    const updateRecentColors = (color: string) => {
        if (recentColors.includes(color)) {
            return;
        }
        const newRecentColors = [color, ...recentColors];
        if (newRecentColors.length > 18) {
            newRecentColors.pop();
        }
        setRecentColors(newRecentColors);
    };

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

const mapStateToProps = (state: any) => ({
    recentColors: selectionStateBranch.selectors.getRecentColors(state),
});

const dispatchToPropsMap = {
    setColorChanges: selectionStateBranch.actions.setColorChanges,
    setRecentColors: selectionStateBranch.actions.setRecentColors,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ColorPicker);
