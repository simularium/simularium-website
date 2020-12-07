import * as React from "react";

import ScaleBarImage from "../../assets/scale-bar.svg";

const styles = require("./style.css");

interface ScaleBarProps {
    length: number;
    unit: string;
}

const ScaleBar = (scaleBarProps: ScaleBarProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.text}>
                {scaleBarProps.length} {scaleBarProps.unit}
            </div>
            <img src={ScaleBarImage} />
        </div>
    );
};
export default ScaleBar;
