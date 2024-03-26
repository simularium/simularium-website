import React from "react";
import { ISimulariumFile } from "@aics/simularium-viewer";

import { DATA_BUCKET_URL } from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Download } from "../Icons";
import NavButtonWithTooltip from "../NavButtonWithTooltip";

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
    const fileName = simulariumFile.name;
    const isDisabled = !fileName || isBuffering;

    const getHref = () => {
        if (isNetworkedFile) {
            return `${DATA_BUCKET_URL}/trajectory/${simulariumFile.name}`;
        } else {
            const localFile = simulariumFile as LocalSimFile; // isNetworkedFile checks for this
            const data: ISimulariumFile = localFile.data;
            const blob = data.getAsBlob();
            return URL.createObjectURL(blob);
        }
    };

    const downloadFile = (): void => {
        const downloadLink = document.createElement("a");
        downloadLink.download = fileName;
        downloadLink.style.display = "none";
        downloadLink.href = getHref();
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    };

    return (
        <NavButtonWithTooltip
            titleText="Download"
            buttonType="action"
            icon={Download}
            clickHandler={downloadFile}
            isDisabled={isDisabled}
            tooltipText={{
                default: "Download trajectory",
                disabled: "Load a model to perform this action",
            }}
            tooltipPlacement="bottomLeft"
        />
    );
};

export default DownloadTrajectoryMenu;
