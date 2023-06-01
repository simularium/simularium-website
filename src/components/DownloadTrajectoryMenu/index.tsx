import React from "react";
import { Button, Tooltip } from "antd";
import { ISimulariumFile } from "@aics/simularium-viewer/type-declarations";

import { DATA_BUCKET_URL, TOOLTIP_COLOR } from "../../constants";
import {
    NetworkedSimFile,
    LocalSimFile,
    isNetworkSimFileInterface,
} from "../../state/trajectory/types";
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
    const fileIsLoaded = () => !!simulariumFile.name;

    const getHref = () => {
        if (!fileIsLoaded()) {
            return "";
        }
        if (isNetworkSimFileInterface(simulariumFile)) {
            return `${DATA_BUCKET_URL}/trajectory/${simulariumFile.name}`;
        } else {
            const data: ISimulariumFile = simulariumFile.data;
            // won't work if they loaded a binary file
            // TODO: need to wait for simulariumFile.data.getAsBlob() to be created on viewer;
            const blob = data.getAsBlob();
            return URL.createObjectURL(blob);
        }
    };

    const downloadFile = async (fileName: string): Promise<void> => {
        const downloadLink = document.createElement("a");
        setIsDownloading(true);
        downloadLink.download = fileName;
        downloadLink.style.display = "none";
        downloadLink.href = getHref();
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
        setIsDownloading(false);
    };

    const onClick = () => {
        if (!fileIsLoaded()) {
            return;
        }
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
                    disabled={!fileIsLoaded() || isBuffering || isDownloading}
                >
                    Download {Download}
                </Button>
            </Tooltip>
        </div>
    );
};

export default DownloadTrajectoryMenu;
