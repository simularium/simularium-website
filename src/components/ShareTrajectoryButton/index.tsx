import React from "react";
import { Button, Tooltip } from "antd";

import { TOOLTIP_COLOR } from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Share } from "../Icons";
import ShareTrajectoryModal from "../ShareTrajectoryModal";

import styles from "./style.css";
import { isOnlineTrajectory } from "../../util/userUrlHandling";

interface ShareTrajectoryButtonProps {
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const ShareTrajectoryButton = ({
    simulariumFile,
}: ShareTrajectoryButtonProps): JSX.Element => {
    const [isSharing, setIsSharing] = React.useState(false);

    const trajectoryIsSharable = isOnlineTrajectory(location.href);

    const handleShare = () => {
        setIsSharing(!isSharing);
    };

    const handleTooltipOpen = () => {
        if (isSharing || !simulariumFile.name) return false;
    };

    return (
        <div className={styles.container}>
            <Tooltip
                title={"Share this trajectory"}
                placement="bottomLeft"
                color={TOOLTIP_COLOR}
                open={handleTooltipOpen()}
            >
                {isSharing ? (
                    <div className={styles.overlay}>
                        <ShareTrajectoryModal
                            trajectoryIsSharable={trajectoryIsSharable}
                            closeModal={handleShare}
                        />
                    </div>
                ) : null}
                <Button
                    className={styles.shareButton}
                    onClick={handleShare}
                    type="primary"
                    disabled={!simulariumFile.name || isSharing}
                >
                    Share {Share}
                </Button>
            </Tooltip>
        </div>
    );
};

export default ShareTrajectoryButton;
