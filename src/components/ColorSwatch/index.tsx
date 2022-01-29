import * as React from "react";

const styles = require("./styles.css");

interface ColorSwatchProps {
    color: string;
}

const ColorSwatch = ({ color }: ColorSwatchProps): JSX.Element => {
    return (
        <div className={styles.container} style={{ backgroundColor: color }} />
    );
};

export default ColorSwatch;
