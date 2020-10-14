import * as React from "react";

import { TUTORIAL_PATHNAME } from "../../routes";

const styles = require("./style.css");

const NoTypeMappingText: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <h3>Unable to load UI controls</h3>
            <p>
                Review the{" "}
                <a href="https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/akamatsu_0020.simularium">
                    example data
                </a>{" "}
                or{" "}
                <a href={`${TUTORIAL_PATHNAME}#convert-your-data`}>
                    the instructions on converting your data.
                </a>{" "}
            </p>
        </div>
    );
};

export default NoTypeMappingText;
