import React, { useEffect, useState } from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Popover, Tooltip } from "antd";
import { HexColorInput, HexColorPicker } from "react-colorful";
import classNames from "classnames";

import selectionStateBranch from "../../state/selection";
import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import {
    ColorChangesMap,
    SetColorChangesAction,
    SetRecentColorsAction,
} from "../../state/selection/types";

import styles from "./style.css";

interface ColorPickerProps {
    initialColor: string;
    agentName: string;
    tags: string[];
    recentColors: string[];
    isOpen: boolean;
    closePopover: () => void;
    setColorChanges: ActionCreator<SetColorChangesAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

const ColorPicker = ({
    initialColor,
    agentName,
    tags,
    recentColors,
    isOpen,
    closePopover,
    setColorChanges,
    setRecentColors,
}: ColorPickerProps) => {
    const [color, setColor] = useState(initialColor);

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

    const renderColorPickerComponent = () => (
        <div className={styles.container}>
            <HexColorPicker color={color} onChange={setColor} />
            <div className={styles.selectionDisplay}>
                <div className={styles.oldColorContainer}>
                    <div
                        className={styles.oldColor}
                        style={{ backgroundColor: initialColor }}
                        onClick={() => {
                            setColor(initialColor);
                        }}
                    ></div>
                    <p> CURRENT </p>
                </div>
                <div className={styles.oldColorContainer}>
                    <div
                        className={styles.newColor}
                        style={{ backgroundColor: color }}
                    ></div>
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
                    <Tooltip
                        key={color}
                        align={{ offset: [2, 5] }}
                        overlayClassName={styles.tooltip}
                        title={color.replace("#", "")}
                    >
                        <button
                            key={color}
                            className={styles.swatch}
                            style={{ background: color }}
                            onClick={() => setColor(color)}
                        />
                    </Tooltip>
                ))}
            </div>
            <p className={styles.recentColorText}> Recent </p>
            <div className={styles.colors}>
                {recentColors.map((color) => (
                    <button
                        key={color}
                        className={styles.swatch}
                        style={{ background: color }}
                        onClick={() => setColor(color)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <Popover
            overlayClassName={styles.popover}
            open={isOpen}
            content={renderColorPickerComponent()}
            placement="right"
            onOpenChange={closePopover}
            trigger="click"
        />
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
