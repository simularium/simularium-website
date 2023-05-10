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
    const [isDownloading, setIsDownloading] = React.useState(false);

    const isLocalSimFile = (
        file: LocalSimFile | NetworkedSimFile
    ): file is LocalSimFile => {
        return (file as LocalSimFile).lastModified !== undefined;
    };

    const fetchFile = async (fileName: string): Promise<string> => {
        try {
            const response = await fetch(
                `${DATA_BUCKET_URL}/trajectory/${fileName}`
            );
            const data = await response.text();
            return data;
        } catch {
            console.log("error fetching file");
            return "";
        }
    };

    const downloadFile = async (fileName: string): Promise<void> => {
        let blob: Blob = new Blob();
        let data: BlobPart = "";
        setIsDownloading(true);

        if (!isLocalSimFile(simulariumFile)) {
            console.log("downloading networked file");
            try {
                data = await fetchFile(simulariumFile.name);
                blob = new Blob([data], {
                    type: "text/plain;charset=utf-8",
                });
            } catch {
                console.log("error downloading file");
                setIsDownloading(false);
                return;
            }
        } else {
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
        setIsDownloading(false);
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
                    isDownloading
                        ? "Downloading..."
                        : simulariumFile.name
                        ? "Download trajectory"
                        : "Load a trajectory to perform this action"
                }
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={styles.downloadButton}
                    onClick={onClick}
                    type="primary"
                    disabled={
                        !simulariumFile.name || isBuffering || isDownloading
                    }
                >
                    Download {Download}
                </Button>
            </Tooltip>
        </div>
    );
};

export default DownloadTrajectoryMenu;
