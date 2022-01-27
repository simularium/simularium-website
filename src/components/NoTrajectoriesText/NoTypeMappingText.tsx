import * as React from "react";

import { TUTORIAL_PATHNAME } from "../../routes";
import { DATA_BUCKET_URL } from "../../constants";

const styles = require("../NoTrajectoriesText/style.css");

const NoTypeMappingText = () => {
    return (
        <div className={styles.container}>
            <h3>Unable to load UI controls</h3>
            <p>
                Review the{" "}
                <a
                    href={`${DATA_BUCKET_URL}/trajectory/endocytosis.simularium`}
                >
                    example data
                </a>{" "}
                or{" "}
                <a
                    href={`${TUTORIAL_PATHNAME}#convert-your-data`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    the instructions on converting your data.
                </a>{" "}
            </p>
        </div>
    );
};

export default NoTypeMappingText;
