import * as React from "react";
import { Link } from "react-router-dom";
import { ActionCreator } from "redux";

import { RequestNetworkFileAction } from "../../state/trajectory/types";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
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
            <h3>Ways to get started:</h3>
            <p>
                <ol>
                    <li>Drag and drop a .simularium file onto this window</li>
                    <li>
                        <Link
                            onClick={() => handleClick(exampleTrajectory)}
                            to={{
                                search: `?${URL_PARAM_KEY_FILE_NAME}=${exampleTrajectory.id}`,
                            }}
                        >
                            Load an example
                        </Link>{" "}
                        now or browse examples from the{" "}
                        <a href="/#try-simularium-now">start page</a>
                    </li>
                    <li>
                        Import common file types through the Load Model menu
                        button, including:
                        <ul>
                            <li>Smoldyn</li>
                            <li>Cytosim</li>
                            <li>cellPACK</li>
                            <li>SpringSaLaD</li>
                        </ul>
                    </li>
                    <li>
                        Convert other file types using{" "}
                        <a
                            href={`${TUTORIAL_PATHNAME}#convert-your-data`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            this tutorial
                        </a>
                    </li>
                </ol>
            </p>
        </div>
    );
};

export default NoTrajectoriesText;
