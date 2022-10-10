import * as React from "react";
import { Link } from "react-router-dom";
import { ActionCreator } from "redux";

import { RequestNetworkFileAction } from "../../state/trajectory/types";
import { URL_PARAM_KEY_FILE_NAME, DATA_BUCKET_URL } from "../../constants";
import TRAJECTORIES from "../../constants/networked-trajectories";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { TUTORIAL_PATHNAME } from "../../routes";

import styles from "./style.css";

interface NoTrajectoriesTextProps {
    selectFile: ActionCreator<RequestNetworkFileAction>;
}

const NoTrajectoriesText = ({
    selectFile,
}: NoTrajectoriesTextProps): JSX.Element => {
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
                <a
                    href={`${DATA_BUCKET_URL}/trajectory/endocytosis.simularium`}
                >
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
                        search: `?${URL_PARAM_KEY_FILE_NAME}=${exampleTrajectory.id}`,
                    }}
                >
                    Load an example instead.
                </Link>
            </p>
        </div>
    );
};

export default NoTrajectoriesText;
