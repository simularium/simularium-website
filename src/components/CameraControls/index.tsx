import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip, Radio } from "antd";
import classNames from "classnames";
import { useHotkeys, useIsHotkeyPressed } from "react-hotkeys-hook";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";
import { RadioChangeEvent } from "antd/lib/radio";

const GroupedRadio = Radio.Group;
const styles = require("./style.css");

const PAN = "pan";
const ROTATE = "rotate";
const CAMERA_MODE_MODIFIER_KEYS = ["command+*", "shift+*"]; //key

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
    const [isModifyingClick, setIsModifyingClick] = useState(false);
    const wasModified: { current: boolean | undefined } = useRef();
    useHotkeys(`${CAMERA_MODE_MODIFIER_KEYS.join(",")}`, (event, handler) => {
        console.log("hit", handler.key);
        if (CAMERA_MODE_MODIFIER_KEYS.includes(handler.key)) {
            return setIsModifyingClick(true);
        }
    });

    useHotkeys(
        "*",
        () => {
            if (wasModified.current) {
                return setIsModifyingClick(false);
            }
        },
        { keyup: true }
    );

    useEffect(() => {
        console.log("USING EFFECT");
        if (
            (isModifyingClick && !wasModified.current) ||
            (wasModified.current && !isModifyingClick)
        ) {
            // if we have just entered, or just exited a key modified state,
            // toggle the mode, but importantly, this isn't going to call the simularium controller function
            setMode(mode === PAN ? ROTATE : PAN);
        } else if (!wasModified.current && !isModifyingClick) {
            // only call the simularium controller if it's not a modifier key
            // because the viewer is already setting the mode
            setPanningMode(mode === PAN);
        }
        wasModified.current = isModifyingClick;
    });

    const onRadioChange = (changeEvent: RadioChangeEvent) => {
        setMode(changeEvent.target.value);
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
                        title="Rotate"
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
                    <Tooltip placement="left" title="Pan" color={TOOLTIP_COLOR}>
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
                <Tooltip placement="left" title="Zoom in" color={TOOLTIP_COLOR}>
                    <Button
                        className={styles.btn}
                        size="small"
                        icon={Icons.ZoomIn}
                        onClick={zoomIn}
                    />
                </Tooltip>
                <Tooltip
                    placement="left"
                    title="Zoom out"
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
                title="Reset camera"
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
