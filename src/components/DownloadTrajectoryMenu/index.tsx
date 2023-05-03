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
    const isLocalSimFile = (
        file: LocalSimFile | NetworkedSimFile
    ): file is LocalSimFile => {
        return (file as LocalSimFile).lastModified !== undefined;
    };

    const fetchFile = async (fileName: string): Promise<string> => {
        try {
            const response = await fetch(
                //JOE QUESTION what URL to use
                // `URLUNKOWN/download?file={${fileName}.simularium}`
                `https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/BloodPlasma.simularium`
                // `https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/{fileName}`
            );
            const data = await response.text();
            return data;
        } catch {
            console.log("error fetching file");
            return "";
        }
    };

    const downloadFile = async (fileName: string): Promise<void> => {
        let blob: Blob | null = new Blob();
        let data: BlobPart = "";

        if (!isLocalSimFile(simulariumFile)) {
            console.log("downloading networked file");
            try {
                data = await fetchFile(simulariumFile.name);
                //JOE QUESTION: what is the appropriate type for the blob?
                blob = new Blob([data], {
                    type: "text/plain;charset=utf-8",
                });
            } catch {
                console.log("error downloading file");
            }
        }
        // if we have a local file, we can just download it, but how to make sure that we capture viewer state and selection?
        else {
            data = JSON.stringify(simulariumFile.data);
            blob = new Blob([data.slice(18, -1)], {
                type: "text/plain;charset=utf-8",
            });
        }
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
        console.log("sim file name", simulariumFile.name);
        downloadFile(simulariumFile.name);
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
