import * as React from "react";

import styles from "./styles.css";

interface ColorSwatchProps {
    color: string;
}

const ColorSwatch = ({ color }: ColorSwatchProps): JSX.Element => {
    return (
        <div className={styles.container} style={{ backgroundColor: color }} />
    );
};

export default ColorSwatch;
