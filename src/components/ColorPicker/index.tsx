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
    childrenHaveDifferentColors?: boolean;
    selectedColor: string;
    agentName: string;
    tags: string[];
    recentColors: string[];
    setColorChange: ActionCreator<SetColorChangeAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

const ColorPicker = ({
    agentName,
    tags,
    recentColors,
    setColorChange,
    setRecentColors,
    selectedColor,
    childrenHaveDifferentColors,
}: ColorPickerProps) => {
    const [color, setColor] = useState(selectedColor);
    const [debouncedColor] = useDebounce(color, 250);
    const isInitialRender = useRef(true);
    const [isColorPickerVisible, setColorPickerVisible] = useState(false);
    const [lastSelectedColor, setLastSelectedColor] = useState(selectedColor);

    const togglePopover = () => {
        if (isColorPickerVisible) {
            setColorPickerVisible(false);
        } else {
            setLastSelectedColor(color);
            setColorPickerVisible(true);
        }
    };

    const handleColorChange = (color: string) => {
        const colorChange: ColorChange = {
            agent: { name: agentName, tags: tags },
            color: color.toLowerCase(),
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
                            style={{ backgroundColor: lastSelectedColor }}
                            onClick={() => {
                                setColor(lastSelectedColor);
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
                        onChange={(color) => setColor(color.toLowerCase)}
                    />
                    <label>Hex</label>
                </div>
            </div>
            <div
                className={classNames([
                    styles.colorsContainer,
                    styles.availableColors,
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
            <h4 className={styles.subTitle}>Recent</h4>
            <div className={styles.colorsContainer}>
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
    const style = childrenHaveDifferentColors
        ? { border: "1px solid #d3d3d3" }
        : { backgroundColor: color };

    return (
        <Popover
            overlayClassName={styles.popover}
            open={isColorPickerVisible}
            content={renderColorPickerComponent()}
            placement="bottomLeft"
            onOpenChange={togglePopover}
            trigger="click"
        >
            <label
                className={classNames(
                    styles.agentSwatchContainer,
                    "agent-swatch-container"
                )}
            >
                <div
                    className={classNames(styles.agentSwatch, "agent-swatch")}
                    style={style}
                    onClick={togglePopover}
                ></div>
            </label>
        </Popover>
    );
};

export default ColorPicker;
