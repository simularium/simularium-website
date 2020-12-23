import * as React from "react";
import { Collapse } from "antd";

import visualGlossary from "../../constants/visual-glossary";
import visualGlossaryImage from "../../assets/visual-glossary.png";
import { VisualGlossaryItem } from "../../constants/interfaces";

const styles = require("./style.css");

const VisualGlossary: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <img src={visualGlossaryImage} />
            <Collapse>
                <Collapse.Panel header="Visual Glossary Key" key="1">
                    <ol className={styles.topLevelList}>
                        {visualGlossary.map((item: VisualGlossaryItem) => {
                            return (
                                <li key={item.label}>
                                    <b>{item.label}</b>
                                    <br />
                                    {item.description}
                                    {item.bulletItems && (
                                        <ul>
                                            {item.bulletItems.map(
                                                (bullet: string, i) => {
                                                    return (
                                                        <li key={i}>
                                                            {bullet}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default VisualGlossary;
