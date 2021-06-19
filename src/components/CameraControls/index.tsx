import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip, Radio } from "antd";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";
import { RadioChangeEvent } from "antd/lib/radio";

const GroupedRadio = Radio.Group;
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
            console.log("KEY down");
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
        console.log("key pressed", keyPressed, lastKeyPressed.current);
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

    const onRadioChange = (changeEvent: RadioChangeEvent) => {
        return setMode(changeEvent.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.moveButtons}>
                <GroupedRadio
                    className={styles.radioGroup}
                    size="small"
                    name="camera-movement"
                    defaultValue={mode}
                    value={mode}
                    onChange={onRadioChange}
                >
                    <Tooltip
                        placement="left"
                        title="Rotate (SHIFT or CMD)"
                        color={TOOLTIP_COLOR}
                    >
                        <Radio.Button
                            className={styles.radioBtn}
                            value={"rotate"}
                        >
                            <span
                                className={classNames([
                                    "icon-moon",
                                    "anticon",
                                    styles.rotate,
                                ])}
                            />
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip
                        placement="left"
                        title="Pan (SHIFT or CMD)"
                        color={TOOLTIP_COLOR}
                    >
                        <Radio.Button className={styles.radioBtn} value="pan">
                            <span
                                className={classNames([
                                    "icon-moon",
                                    "anticon",
                                    styles.pan,
                                ])}
                            />
                        </Radio.Button>
                    </Tooltip>
                </GroupedRadio>
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
