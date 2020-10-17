import * as React from "react";
import { Button } from "antd";

import Icons from "../Icons";

const styles = require("./style.css");

interface CameraControlsProps {
    resetCamera: () => void;
}

const CameraControls = ({ resetCamera }: CameraControlsProps) => {
    return (
        <div className={styles.container}>
            <Button
                className={styles.btn}
                size="small"
                icon={Icons.Reset}
                onClick={resetCamera}
            />
        </div>
    );
};
export default CameraControls;
