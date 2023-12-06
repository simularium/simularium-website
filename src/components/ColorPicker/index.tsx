import React, { useEffect, useRef, useState } from "react";
import { ActionCreator } from "redux";
import { Popover, Tooltip } from "antd";
import { HexColorInput, HexColorPicker } from "react-colorful";
import classNames from "classnames";
import { useDebounce } from "use-debounce";
import { ColorChange } from "@aics/simularium-viewer";

import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import {
    SetColorChangeAction,
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
    setColorChange: ActionCreator<SetColorChangeAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

const ColorPicker = ({
    initialColor,
    agentName,
    tags,
    recentColors,
    isOpen,
    closePopover,
    setColorChange,
    setRecentColors,
}: ColorPickerProps) => {
    const [color, setColor] = useState(initialColor);
    const [debouncedColor] = useDebounce(color, 250);
    const isInitialRender = useRef(true);

    const handleColorChange = (color: string) => {
        const colorChange: ColorChange = {
            agent: { name: agentName, tags: tags },
            color: color,
        };

        setColorChange(colorChange);
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
        <div className={styles.colorPicker}>
            <HexColorPicker color={color} onChange={setColor} />
            <div className={styles.selectionDisplay}>
                <div className={styles.colorSelections}>
                    <div className={styles.selection}>
                        <div
                            className={styles.largeSwatch}
                            style={{ backgroundColor: initialColor }}
                            onClick={() => {
                                setColor(initialColor);
                            }}
                        ></div>
                        <label>Current</label>
                    </div>
                    <div className={styles.selection}>
                        <div
                            className={styles.largeSwatch}
                            style={{ backgroundColor: color }}
                        ></div>
                        <label>New</label>
                    </div>
                </div>
                <div className={styles.selection}>
                    <HexColorInput
                        className={styles.hexInput}
                        color={color}
                        onChange={setColor}
                    />
                    <label>Hex</label>
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
            <h4 className={styles.recentColorText}> Recent </h4>
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
