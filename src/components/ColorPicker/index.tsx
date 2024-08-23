import React, { useEffect, useRef, useState } from "react";
import { ActionCreator } from "redux";
import { Popover, Tooltip } from "antd";
import { HexColorInput, HexColorPicker } from "react-colorful";
import classNames from "classnames";
import { useDebounce } from "use-debounce";
import { ColorChange } from "@aics/simularium-viewer";

import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import { SetRecentColorsAction } from "../../state/selection/types";

import styles from "./style.css";

interface ColorPickerProps {
    childrenHaveDifferentColors?: boolean;
    selectedColor: string;
    agentName: string;
    tags: string[];
    recentColors: string[];
    changeColor: (change: ColorChange) => void;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

const ColorPicker = ({
    agentName,
    tags,
    recentColors,
    changeColor,
    setRecentColors,
    selectedColor: initialColor,
    childrenHaveDifferentColors,
}: ColorPickerProps): JSX.Element => {
    const [currentColor, setCurrentColor] = useState(initialColor);
    const [debouncedColor] = useDebounce(currentColor, 250);
    const isInitialRender = useRef(true);
    const [isColorPickerVisible, setColorPickerVisible] = useState(false);
    const [lastSelectedColor, setLastSelectedColor] = useState(initialColor);

    const togglePopover = () => {
        if (isColorPickerVisible) {
            setColorPickerVisible(false);
        } else {
            setLastSelectedColor(currentColor);
            setColorPickerVisible(true);
        }
    };

    const handleColorChange = (newColor: string) => {
        const colorChange: ColorChange = {
            agent: { name: agentName, tags: tags },
            color: newColor.toLowerCase(),
        };
        changeColor(colorChange);
        updateRecentColors(debouncedColor);
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
        } else {
            handleColorChange(debouncedColor);
            updateRecentColors(debouncedColor);
        }
    }, [debouncedColor]);

    useEffect(() => {
        setCurrentColor(initialColor);
    }, [initialColor]);

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
            <HexColorPicker color={currentColor} onChange={setCurrentColor} />
            <div className={styles.selectionDisplay}>
                <div className={styles.colorSelections}>
                    <div className={styles.selection}>
                        <div
                            className={styles.largeSwatch}
                            style={{ backgroundColor: lastSelectedColor }}
                            onClick={() => {
                                setCurrentColor(lastSelectedColor);
                            }}
                        ></div>
                        <label>
                            {lastSelectedColor == currentColor
                                ? ""
                                : "Previous"}
                        </label>
                    </div>
                    <div className={styles.selection}>
                        <div
                            className={styles.largeSwatch}
                            style={{ backgroundColor: currentColor }}
                        ></div>
                        <label>New</label>
                    </div>
                </div>
                <div className={styles.selection}>
                    <HexColorInput
                        className={styles.hexInput}
                        color={currentColor}
                        onChange={(color) =>
                            setCurrentColor(color.toLowerCase())
                        }
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
                            onClick={() => setCurrentColor(color)}
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
                        onClick={() => setCurrentColor(color)}
                    />
                ))}
            </div>
        </div>
    );
    const style = childrenHaveDifferentColors
        ? { border: "1px solid #d3d3d3" }
        : { backgroundColor: currentColor };

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
