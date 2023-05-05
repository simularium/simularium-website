import React from "react";
import { Button, Tooltip } from "antd";

import { DATA_BUCKET_URL, TOOLTIP_COLOR } from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Download } from "../Icons";

import styles from "./style.css";

interface DownloadTrajectoryMenuProps {
    isBuffering: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const DownloadTrajectoryMenu = ({
    isBuffering,
    simulariumFile,
}: DownloadTrajectoryMenuProps): JSX.Element => {
    const isLocalSimFile = (
        file: LocalSimFile | NetworkedSimFile
    ): file is LocalSimFile => {
        return (file as LocalSimFile).lastModified !== undefined;
    };

    const fetchFile = async (fileName: string): Promise<string> => {
        try {
            const response = await fetch(
                // `https://aics-simularium-data.s3.us-east-2.amazonaws.com/trajectory/BloodPlasma.simularium`
                `${DATA_BUCKET_URL}/trajectory/${fileName}`
            );
            const data = await response.text();
            return data;
        } catch {
            //QUESTION:should i be passing down and using the setError action?
            console.log("error fetching file");
            return "";
        }
    };

    const downloadFile = async (fileName: string): Promise<void> => {
        let blob: Blob = new Blob();
        let data: BlobPart = "";

        if (!isLocalSimFile(simulariumFile)) {
            console.log("downloading networked file");
            try {
                data = await fetchFile(simulariumFile.name);
                blob = new Blob([data], {
                    type: "text/plain;charset=utf-8",
                });
            } catch {
                //QUESTION: should i be passing down and using the setError action?
                console.log("error downloading file");
                return;
            }
        }
        // QUESTION:
        // user selections of viewer options are not captured in the output
        // is that necessary for MVP/acceptance on this feature?
        else {
            data = JSON.stringify(simulariumFile.data);
            // QUESTION: dealing with some typing issues here, hence the slice call
            // don't think this: data.slice(18, -1) is the most bulletproof or ideal way to do this,
            // so curious what others think.
            // the issue is that simularifumFile.data when stringified looks like this:
            // {simulariumFile: {trajectory...
            // but that first key "simulariumFile" is not present on the ISimulariumFile interface
            // altering the interface to include it would be a breaking change that messes with other functions
            // so for now, just slicing it off works, thoughts on best practices here?
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
        if (!simulariumFile.name) {
            return;
        }
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
                    disabled={!simulariumFile.name || isBuffering}
                >
                    Download {Download}
                </Button>
            </Tooltip>
        </div>
    );
};

export default DownloadTrajectoryMenu;
