import React, { useEffect, useState } from "react";
import { Button, Tooltip, Radio } from "antd";
import classNames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";
import { RadioChangeEvent } from "antd/lib/radio";

const GroupedRadio = Radio.Group;
const styles = require("./style.css");

const ROTATE_HOT_KEY = "r";
const PAN_HOT_KEY = "p";
const PAN = "pan";
const ROTATE = "rotate";

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

    useHotkeys(`${ROTATE_HOT_KEY}, ${PAN_HOT_KEY}`, (event, handler) => {
        return setMode(handler.key === PAN_HOT_KEY ? PAN : ROTATE);
    });

    useEffect(() => {
        setPanningMode(mode === PAN);
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
