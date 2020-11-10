import * as React from "react";
import { Button, Tooltip } from "antd";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";

const styles = require("./style.css");

interface CameraControlsProps {
    resetCamera: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
}

const CameraControls = ({
    resetCamera,
    zoomIn,
    zoomOut,
}: CameraControlsProps) => {
    document.onkeyup = function(event: KeyboardEvent) {
        if (event.key === "ArrowUp") {
            zoomIn();
        } else if (event.key === "ArrowDown") {
            zoomOut();
        }
    };

    return (
        <div className={styles.container}>
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
