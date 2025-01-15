import React from "react";
import { ISimulariumFile } from "@aics/simularium-viewer";

import { DOWNLOAD_URL } from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Download } from "../Icons";
import { TooltipButton } from "../CustomButton";
import { ButtonClass } from "../../constants/interfaces";

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
            return `${DOWNLOAD_URL}?file=${simulariumFile.name}`;
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
        <TooltipButton
            variant={ButtonClass.Action}
            titleText="Download"
            icon={Download}
            onClick={downloadFile}
            disabled={isDisabled}
            tooltipText={{
                defaultText: "Download trajectory",
                disabledText: "Load a model to perform this action",
            }}
            tooltipPlacement="bottomRight"
        />
    );
};

export default DownloadTrajectoryMenu;
