import * as React from "react";
import { Link } from "react-router-dom";
import { ActionCreator } from "redux";

import { RequestNetworkFileAction } from "../../state/metadata/types";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import TRAJECTORIES from "../../constants/networked-trajectories";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { TUTORIAL_PATHNAME } from "../../routes";

const styles = require("./style.css");

interface NoTrajectoriesTextProps {
    selectFile: ActionCreator<RequestNetworkFileAction>;
}

const NoTrajectoriesText = ({ selectFile }: NoTrajectoriesTextProps) => {
    const handleClick = (trajectoryData: TrajectoryDisplayData) => {
        selectFile({
            name: trajectoryData.id,
            title: trajectoryData.title,
        });
    };
    const exampleTrajectory = TRAJECTORIES[0];

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
                    onClick={() => handleClick(exampleTrajectory)}
                    to={{
                        search: `?${URL_PARAM_KEY_FILE_NAME}=${
                            exampleTrajectory.id
                        }`,
                    }}
                >
                    Load an example instead.
                </Link>
            </p>
        </div>
    );
};

export default NoTrajectoriesText;
