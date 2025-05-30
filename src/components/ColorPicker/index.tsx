import React, { useEffect, useRef, useState } from "react";
import { ActionCreator } from "redux";
import { Popover, Tooltip } from "antd";
import { HexColorInput, HexColorPicker } from "react-colorful";
import classNames from "classnames";
import { useDebounce } from "use-debounce";

import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";
import { ColorChange } from "../../constants/interfaces";
import { COLORPICKER_POPOVER_OFFSET } from "../../constants";
import { SetRecentColorsAction } from "../../state/selection/types";

import styles from "./style.css";

interface ColorPickerProps {
    childrenHaveDifferentColors?: boolean;
    selectedColor: string;
    agentName: string;
    tags: string[];
    recentColors: string[];
    applyUserColor: (colorChange: ColorChange) => void;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

const ColorPicker = ({
    agentName,
    tags,
    recentColors,
    applyUserColor,
    setRecentColors,
    selectedColor: initialColor,
    childrenHaveDifferentColors,
}: ColorPickerProps): JSX.Element => {
    const [currentColor, setCurrentColor] = useState(initialColor);
    const [debouncedColor] = useDebounce(currentColor, 250);
    const isUserInteraction = useRef(false);
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
        applyUserColor(colorChange);
        updateRecentColors(newColor.toLowerCase());
    };

    useEffect(() => {
        if (isUserInteraction.current) {
            handleColorChange(debouncedColor);
            isUserInteraction.current = false;
        }
    }, [debouncedColor]);

    useEffect(() => {
        setCurrentColor(initialColor);
    }, [initialColor]);

    const onColorUpdate = (newColor: string) => {
        isUserInteraction.current = true;
        setCurrentColor(newColor);
    };

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
            <HexColorPicker color={currentColor} onChange={onColorUpdate} />
            <div className={styles.selectionDisplay}>
                <div className={styles.colorSelections}>
                    <div className={styles.selection}>
                        <div
                            className={styles.largeSwatch}
                            style={{ backgroundColor: lastSelectedColor }}
                            onClick={() => {
                                onColorUpdate(lastSelectedColor);
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
                        onChange={(color) => onColorUpdate(color.toLowerCase())}
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
                            onClick={() => onColorUpdate(color)}
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
                        onClick={() => onColorUpdate(color)}
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
            overlayInnerStyle={{ padding: 0 }}
            align={{ targetOffset: COLORPICKER_POPOVER_OFFSET }}
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
