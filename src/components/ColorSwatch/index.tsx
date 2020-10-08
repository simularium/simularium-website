import * as React from "react";

const styles = require("./styles.css");

interface ColorSwatchProps {
    color: string;
}

const ColorSwatch = ({ color }: ColorSwatchProps) => {
    return (
        <div
            className={styles.container}
            style={{ backgroundColor: "#418463" }}
        />
    );
};

export default ColorSwatch;
