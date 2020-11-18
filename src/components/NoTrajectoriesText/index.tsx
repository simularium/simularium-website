import * as React from "react";
import { Link } from "react-router-dom";

import { TUTORIAL_PATHNAME } from "../../routes";

const styles = require("./style.css");

const NoTrajectoriesText: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <h3>No trajectories loaded</h3>
            <p>
                To view a simulation, either{" "}
                <a href="https://aics-agentviz-data.s3.us-east-2.amazonaws.com/trajectory/endocytosis.simularium">
                    download
                </a>{" "}
                our example data or{" "}
                <a
                    href={`${TUTORIAL_PATHNAME}#convert-your-data`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    convert
                </a>{" "}
                your own data, and then drag and drop the file onto this window.
            </p>
            <p>
                <Link
                    to={TUTORIAL_PATHNAME}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Load an example instead.
                </Link>
            </p>
        </div>
    );
};

export default NoTrajectoriesText;
