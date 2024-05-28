import * as React from "react";

import { TUTORIAL_PATHNAME } from "../../routes";
import { DOWNLOAD_URL } from "../../constants";

import styles from "../NoTrajectoriesText/style.css";

const NoTypeMappingText = (): JSX.Element => {
    return (
        <div className={styles.container}>
            <h3>Unable to load UI controls</h3>
            <p>
                Review the{" "}
                <a href={`${DOWNLOAD_URL}/trajectory/endocytosis.simularium`}>
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
