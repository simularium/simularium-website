import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";

const styles = require("./style.css");

const PAN = "pan";
const ROTATE = "rotate";
const CAMERA_MODE_MODIFIER_KEYS = ["Meta", "Shift"];
const ZOOM_IN_HK = "ArrowUp";
const ZOOM_OUT_HK = "ArrowDown";
const RESET_HK = "r";
const HOT_KEYS = [ZOOM_IN_HK, ZOOM_OUT_HK, RESET_HK];

interface CameraControlsProps {
    resetCamera: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    setPanningMode: (value: boolean) => void;
}

const CameraControls = ({
    resetCamera,
    zoomIn,
    zoomOut,
    setPanningMode,
}: CameraControlsProps) => {
    const [mode, setMode] = useState("rotate");
    const [keyPressed, setKeyPressed] = useState("");
    const lastKeyPressed = useRef("");
    const isModifierKey = (key: string) =>
        CAMERA_MODE_MODIFIER_KEYS.includes(key);
    useHotkeys(
        "*",
        (event) => {
            if (
                CAMERA_MODE_MODIFIER_KEYS.includes(event.key) ||
                HOT_KEYS.includes(event.key)
            ) {
                return setKeyPressed(event.key);
            }
        },
        { keydown: true }
    );

    useHotkeys(
        "*",
        () => {
            return setKeyPressed("");
        },
        { keyup: true }
    );

    useEffect(() => {
        if (
            !isModifierKey(lastKeyPressed.current) &&
            !isModifierKey(keyPressed)
        ) {
            // only call the simularium controller if it's not a modifier key
            // because the viewer is already setting the mode
            setPanningMode(mode === PAN);
        }
    }, [mode]);

    useEffect(() => {
        if (
            (isModifierKey(keyPressed) && !lastKeyPressed.current) ||
            (isModifierKey(lastKeyPressed.current) && !keyPressed)
        ) {
            // toggle the mode, so the radio buttons reflect the true state
            lastKeyPressed.current = keyPressed;
            return setMode(mode === PAN ? ROTATE : PAN);
        }
        switch (keyPressed) {
            case ZOOM_IN_HK:
                zoomIn();
                break;
            case ZOOM_OUT_HK:
                zoomOut();
                break;
            case RESET_HK:
                resetCamera();
                break;
            default:
                break;
        }
        lastKeyPressed.current = keyPressed;
    }, [keyPressed]);

    return (
        <div className={styles.container}>
            <div className={styles.moveButtons}>
                <div className={styles.radioGroup}>
                    <Tooltip
                        placement="left"
                        title="Rotate (SHIFT or CMD)"
                        color={TOOLTIP_COLOR}
                    >
                        {/* Should be radio buttons, but using radio buttons 
                        detaches keypressed listener after the button is pressed */}
                        <Button
                            className={classNames([
                                { [styles.active]: mode === ROTATE },
                                styles.radioBtn,
                            ])}
                            onClick={() => setMode(ROTATE)}
                        >
                            <span
                                className={classNames([
                                    "icon-moon",
                                    "anticon",
                                    styles.rotate,
                                ])}
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        placement="left"
                        title="Pan (SHIFT or CMD)"
                        color={TOOLTIP_COLOR}
                    >
                        <Button
                            className={classNames([
                                { [styles.active]: mode === PAN },
                                styles.radioBtn,
                            ])}
                            onClick={() => setMode(PAN)}
                        >
                            <span
                                className={classNames([
                                    "icon-moon",
                                    "anticon",
                                    styles.pan,
                                ])}
                            />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.zoomButtons}>
                <Tooltip
                    placement="left"
                    title="Zoom in ( &uarr; )"
                    color={TOOLTIP_COLOR}
                >
                    <Button
                        className={styles.btn}
                        size="small"
                        icon={Icons.ZoomIn}
                        onClick={zoomIn}
                    />
                </Tooltip>
                <Tooltip
                    placement="left"
                    title="Zoom out ( &darr; )"
                    color={TOOLTIP_COLOR}
                >
                    <Button
                        className={styles.btn}
                        size="small"
                        icon={Icons.ZoomOut}
                        onClick={zoomOut}
                    />
                </Tooltip>
            </div>
            <Tooltip
                placement="left"
                title="Reset camera (R)"
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={styles.btn}
                    size="small"
                    icon={Icons.Reset}
                    onClick={resetCamera}
                />
            </Tooltip>
        </div>
    );
};
export default CameraControls;
