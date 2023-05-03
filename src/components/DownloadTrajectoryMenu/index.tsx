import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ActionCreator } from "redux";
import { Dropdown, Button, MenuProps, Tooltip } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { TOOLTIP_COLOR, URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    ClearSimFileDataAction,
    NetworkedSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
} from "../../state/trajectory/types";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import FileUploadModal from "../FileUploadModal";
import { DownArrow, Download } from "../Icons";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";

import styles from "./style.css";
import { LocalSimFile } from "../../state/trajectory/types";

interface DownloadTrajectoryMenuProps {
    isBuffering: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile; // NetworkedSimFile? i think this would only work with local file, but parent component will accept either
    // selectFile: ActionCreator<RequestNetworkFileAction>;
    // clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    // loadLocalFile: ActionCreator<RequestLocalFileAction>;
    // setViewerStatus: ActionCreator<SetViewerStatusAction>;
    // setError: ActionCreator<SetErrorAction>;
}

const DownloadTrajectoryMenu = ({
    isBuffering,
    simulariumFile,
}: // clearSimulariumFile,
// loadLocalFile,
// selectFile,
// setViewerStatus,
// setError,
DownloadTrajectoryMenuProps): JSX.Element => {
    const downloadFile = (data: string, fileName: string): void => {
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        const downloadLink = document.createElement("a");

        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    };

    const onClick = () => {
        console.log(typeof simulariumFile);
        console.log("sim file data", simulariumFile.data);
        console.log("sim file name", simulariumFile.name);
        downloadFile(simulariumFile.data, simulariumFile.name);
    };

    return (
        <div className={styles.container}>
            <Tooltip
                placement="left"
                title={
                    simulariumFile.name
                        ? "Download trajectory"
                        : "Load a trajectory to perform this action"
                }
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={styles.downloadButton}
                    onClick={onClick}
                    type="primary"
                >
                    Download {Download}
                </Button>
            </Tooltip>
        </div>
    );
};

export default DownloadTrajectoryMenu;
