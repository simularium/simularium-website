import * as React from "react";
import { Collapse } from "antd";

import visualGlossaryImage from "../../assets/visual-glossary.png";

const styles = require("./style.css");

const VisualGlossary: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <img src={visualGlossaryImage} />
            <Collapse>
                <Collapse.Panel header="Visual Glossary Key" key="1">
                    <p>blah</p>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default VisualGlossary;
