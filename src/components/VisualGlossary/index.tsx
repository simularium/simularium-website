import React, { useState, useEffect } from "react";
import { Collapse } from "antd";

import visualGlossary from "../../constants/visual-glossary";
import visualGlossaryImage from "../../assets/visual-glossary.png";
import { VisualGlossaryItem } from "../../constants/interfaces";

const styles = require("./style.css");

const renderGlossaryItems = visualGlossary.map((item: VisualGlossaryItem) => {
    const { label, description, bulletItems } = item;
    return (
        <li key={label}>
            <b>{label}</b>
            <br />
            {description}
            {bulletItems && (
                <ul>
                    {bulletItems.map((bullet: string, i) => (
                        <li key={i}>{bullet}</li>
                    ))}
                </ul>
            )}
        </li>
    );
});

const VisualGlossary = (): JSX.Element => {
    const wideScreenMinWidth = "1622px";

    // Lay out image and legend side-by-side when screen is wide enough
    const [isScreenWide, setIsScreenWide] = useState(
        window.matchMedia(`(min-width: ${wideScreenMinWidth})`).matches
    );
    useEffect(() => {
        window
            .matchMedia(`(min-width: ${wideScreenMinWidth})`)
            .addEventListener("change", (e) => setIsScreenWide(e.matches));
    }, []);

    // Legend box should be collapsed by default when underneath image
    // and always in an open state when next to image
    const collapseProps = isScreenWide && { activeKey: "1" };

    return (
        <div className={styles.container}>
            <img src={visualGlossaryImage} />
            <Collapse {...collapseProps}>
                <Collapse.Panel header="Visual Glossary Key" key="1">
                    <ol className={styles.topLevelList}>
                        {renderGlossaryItems}
                    </ol>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default VisualGlossary;
