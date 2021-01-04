import * as React from "react";
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

const VisualGlossary: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <img src={visualGlossaryImage} />
            <Collapse>
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
