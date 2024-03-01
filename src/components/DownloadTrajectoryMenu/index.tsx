import React from "react";
import { Button, Tooltip } from "antd";
import { ISimulariumFile } from "@aics/simularium-viewer";

import {
    DATA_BUCKET_URL,
    NAV_BAR_TOOLTIP_OFFSET,
    TOOLTIP_COLOR,
    TOOLTIP_DELAY,
} from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Download } from "../Icons";

import styles from "./style.css";

interface DownloadTrajectoryMenuProps {
    isBuffering: boolean;
    isNetworkedFile: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const DownloadTrajectoryMenu = ({
    isBuffering,
    simulariumFile,
    isNetworkedFile,
}: DownloadTrajectoryMenuProps): JSX.Element => {
    const fileIsLoaded = () => !!simulariumFile.name;

    const getHref = () => {
        if (!fileIsLoaded()) {
            return "";
        }
        if (isNetworkedFile) {
            return `${DATA_BUCKET_URL}/trajectory/${simulariumFile.name}`;
        } else {
            const localFile = simulariumFile as LocalSimFile; // isNetworkedFile checks for this
            const data: ISimulariumFile = localFile.data;
            const blob = data.getAsBlob();
            return URL.createObjectURL(blob);
        }
    };

    const downloadFile = (fileName: string): void => {
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

    const isDisabled = !fileIsLoaded() || isBuffering;
    // disabled buttons are wrapped in a span which changes the tooltip offset
    const tooltipOffset = isDisabled ? [-30, -20] : NAV_BAR_TOOLTIP_OFFSET;

    return (
        <div className={styles.container}>
            <Tooltip
                placement="bottomLeft"
                title={
                    isDisabled
                        ? "Load a model to perform this action"
                        : "Download trajectory"
                }
                color={TOOLTIP_COLOR}
                arrowPointAtCenter={true}
                mouseEnterDelay={TOOLTIP_DELAY}
                align={{ offset: tooltipOffset }}
            >
                <Button
                    className={isDisabled ? styles.disabled : undefined}
                    onClick={onClick}
                    type="primary"
                    disabled={isDisabled}
                >
                    Download {Download}
                </Button>
            </Tooltip>
        </div>
    );
};

export default DownloadTrajectoryMenu;
