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
    const [isScreenWide, setIsScreenWide] = useState(
        window.matchMedia("(min-width: 1622px)").matches
    );

    // NOTE: Currently this doesn't do anything... defaultActiveKey seems to only
    // matter at initial page load...
    useEffect(() => {
        window
            .matchMedia("(min-width: 1622px)")
            .addEventListener("change", (e) => setIsScreenWide(e.matches));
    }, []);

    return (
        <div className={styles.container}>
            <img src={visualGlossaryImage} />
            <Collapse defaultActiveKey={isScreenWide ? "1" : []}>
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
