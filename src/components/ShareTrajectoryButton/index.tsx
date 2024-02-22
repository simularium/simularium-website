import React from "react";
import { Button, Tooltip } from "antd";

import { TOOLTIP_COLOR } from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Share } from "../Icons";
import ShareTrajectoryModal from "../ShareTrajectoryModal";

import styles from "./style.css";
import { isOnlineTrajectory } from "../../util/userUrlHandling";

interface ShareTrajectoryButtonProps {
    isBuffering: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const ShareTrajectoryButton = ({
    isBuffering,
    simulariumFile,
}: ShareTrajectoryButtonProps): JSX.Element => {
    const [isSharing, setIsSharing] = React.useState(false);

    const trajectoryIsSharable = isOnlineTrajectory(location.href);

    const handleShare = () => {
        setIsSharing(!isSharing);
    };

    const isDisabled = !simulariumFile.name || isSharing || isBuffering;
    const tooltipOffset = isDisabled ? [0, -30] : [0, -18];

    return (
        <div className={styles.container}>
            {isSharing ? (
                <div className={styles.overlay}>
                    <ShareTrajectoryModal
                        trajectoryIsSharable={trajectoryIsSharable}
                        closeModal={handleShare}
                    />
                </div>
            ) : null}
            <Tooltip
                title={
                    isDisabled
                        ? "Load a model to perform this action"
                        : "Share trajectory"
                }
                placement="bottomLeft"
                color={TOOLTIP_COLOR}
                align={{ offset: tooltipOffset }}
            >
                <Button
                    className={isDisabled ? styles.disabled : undefined}
                    onClick={handleShare}
                    type="primary"
                    disabled={isDisabled}
                >
                    Share {Share}
                </Button>
            </Tooltip>
        </div>
    );
};

export default ShareTrajectoryButton;
