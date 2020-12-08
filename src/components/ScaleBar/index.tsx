import * as React from "react";
import ScaleBarImage from "../../assets/scale-bar.svg";

const styles = require("./style.css");

interface ScaleBarProps {
    label: string;
}

const ScaleBar = (scaleBarProps: ScaleBarProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.text}>{scaleBarProps.label}</div>
            <img src={ScaleBarImage} />
        </div>
    );
};
export default ScaleBar;
