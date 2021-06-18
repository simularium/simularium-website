import * as React from "react";
import { Button, Tooltip, Radio } from "antd";
import classNames from "classnames";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";
import { RadioChangeEvent } from "antd/lib/radio";

const GroupedRadio = Radio.Group;
const styles = require("./style.css");

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
    const onRadioChange = (changeEvent: RadioChangeEvent) => {
        setPanningMode(changeEvent.target.value === "pan");
    };

    return (
        <div className={styles.container}>
            <div className={styles.moveButtons}>
                <GroupedRadio
                    size="small"
                    name="camera-movement"
                    defaultValue="rotate"
                    onChange={onRadioChange}
                >
                    <Tooltip
                        placement="left"
                        title="Rotate"
                        color={TOOLTIP_COLOR}
                    >
                        <Radio.Button
                            className={styles.btn}
                            value={"rotate"}
                            onClick={zoomIn}
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
                        <Radio.Button
                            className={styles.btn}
                            value="pan"
                            onClick={zoomIn}
                        >
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
