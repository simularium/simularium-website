import React, { useEffect, useRef, useState } from "react";
import { ActionCreator } from "redux";
import { Popover, Tooltip } from "antd";
import { HexColorInput, HexColorPicker } from "react-colorful";
import classNames from "classnames";
import { useDebounce } from "use-debounce";

import { ColorChanges } from "../../../../simularium-viewer/type-declarations";
import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import {
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
    const [debouncedColor] = useDebounce(color, 250);
    const isInitialRender = useRef(true);

    const handleColorChange = (color: string) => {
        const colorChanges: ColorChanges[] = [
            {
                agents: [{ name: agentName, tags: tags }],
                color: color,
            },
        ];
        setColorChanges(colorChanges);
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
        } else {
            handleColorChange(debouncedColor);
            updateRecentColors(debouncedColor);
        }
    }, [debouncedColor]);

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

export default ColorPicker;
