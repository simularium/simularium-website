import React, { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import styles from "./style.css";
import classNames from "classnames";

// import { AGENT_COLORS } from "../../containers/ViewerPanel/constants";

const ColorPicker = () => {
    const [color, setColor] = useState("#b32aa9");

    const agentColors = [
        "#fee34d",
        "#f7b232",
        "#bf5736",
        "#94a7fc",
        "#ce8ec9",
        "#58606c",
        "#0ba345",
        "#9267cb",
        "#81dbe6",
        "#94a7fc",
        "#ce8ec9",
        "#58606c",
        "#0ba345",
        "#9267cb",
        "#81dbe6",
        "#0ba345",
        "#9267cb",
        "#81dbe6",
    ];

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

    const blue = "#0000ff";
    const red = "#ff0000";

    return (
        <div className={styles.container}>
            <HexColorPicker color={color} onChange={setColor} />
            <div className={styles.selectionDisplay}>
                <div className={styles.oldColorContainer}>
                    <div className={styles.oldColor}> </div>
                    <p> CURRENT </p>
                </div>
                <div className={styles.oldColorContainer}>
                    <div className={styles.newColor}> </div>
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
                {agentColors.map((color) => (
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

export default ColorPicker;
