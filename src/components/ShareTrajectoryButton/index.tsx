import React from "react";
import { Button, Tooltip } from "antd";

import { TOOLTIP_COLOR } from "../../constants";
import {
    NetworkedSimFile,
    LocalSimFile,
    isLocalFileInterface,
} from "../../state/trajectory/types";
import { Share } from "../Icons";
import ShareTrajectoryModal from "../ShareTrajectoryModal";

import styles from "./style.css";

interface ShareTrajectoryButtonProps {
    isBuffering: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const ShareTrajectoryButton = ({
    isBuffering,
    simulariumFile,
}: ShareTrajectoryButtonProps): JSX.Element => {
    const [isSharing, setIsSharing] = React.useState(false);

    const isLocalFile = isLocalFileInterface(simulariumFile);

    const handleShare = () => {
        setIsSharing(!isSharing);
    };

    const handleTooltipOpen = () => {
        if (isSharing || !simulariumFile.name) {
            return false;
        } else return;
    };

    return (
        <div className={styles.container}>
            <Tooltip
                title={"Share this trajectory"}
                placement="left"
                color={TOOLTIP_COLOR}
                open={handleTooltipOpen()}
            >
                {isSharing ? (
                    <div className={styles.overlay}>
                        <ShareTrajectoryModal
                            isLocalFile={isLocalFile}
                            closeModal={handleShare}
                        />
                    </div>
                ) : null}
                <Button
                    className={styles.shareButton}
                    onClick={handleShare}
                    type="primary"
                    disabled={!simulariumFile.name || isBuffering || isSharing}
                >
                    Share {Share}
                </Button>
            </Tooltip>
        </div>
    );
};

export default ShareTrajectoryButton;
