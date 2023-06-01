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
            const blob = data.getAsBlob();
            return URL.createObjectURL(blob);
        }
    };

    const downloadFile = async (fileName: string): Promise<void> => {
        const downloadLink = document.createElement("a");
        downloadLink.download = fileName;
        downloadLink.style.display = "none";
        downloadLink.href = getHref();
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
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
                    disabled={!fileIsLoaded() || isBuffering}
                >
                    Download {Download}
                </Button>
            </Tooltip>
        </div>
    );
};

export default DownloadTrajectoryMenu;
