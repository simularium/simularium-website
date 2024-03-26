import React from "react";

import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { isOnlineTrajectory } from "../../util/userUrlHandling";
import { Share } from "../Icons";
import ShareTrajectoryModal from "../ShareTrajectoryModal";
import NavButtonWithTooltip from "../NavButtonWithTooltip";

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

    const trajectoryIsSharable = isOnlineTrajectory(location.href);

    const handleShare = () => setIsSharing(!isSharing);

    const isDisabled = !simulariumFile.name || isSharing || isBuffering;
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
            <NavButtonWithTooltip
                tooltipPlacement="bottomLeft"
                titleText="Share"
                buttonType="action"
                icon={Share}
                clickHandler={handleShare}
                isDisabled={isDisabled}
                tooltipText={{
                    default: "Share trajectory",
                    disabled: "Load a model to perform this action",
                }}
            />
        </div>
    );
};

export default ShareTrajectoryButton;
