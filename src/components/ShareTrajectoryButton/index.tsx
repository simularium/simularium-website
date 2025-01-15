import React from "react";

import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { isOnlineTrajectory } from "../../util/userUrlHandling";
import { Share } from "../Icons";
import ShareTrajectoryModal from "../ShareTrajectoryModal";
import NavButtonWithTooltip from "../NavButtonWithTooltip";

interface ShareTrajectoryButtonProps {
    isBuffering: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const ShareTrajectoryButton = ({
    isBuffering,
    simulariumFile,
}: ShareTrajectoryButtonProps): JSX.Element => {
    const [isSharing, setIsSharing] = React.useState(false);

    const trajectoryIsShareable = isOnlineTrajectory(location.href);

    const handleShare = () => setIsSharing(!isSharing);

    const isDisabled = !simulariumFile.name || isSharing || isBuffering;
    return (
        <>
            {isSharing && (
                <ShareTrajectoryModal
                    trajectoryIsShareable={trajectoryIsShareable}
                    closeModal={handleShare}
                />
            )}
            <NavButtonWithTooltip
                tooltipPlacement="bottomLeft"
                titleText="Share"
                icon={Share}
                onClick={handleShare}
                isDisabled={isDisabled}
                tooltipText={{
                    default: "Share trajectory",
                    disabled: "Load a model to perform this action",
                }}
            />
        </>
    );
};

export default ShareTrajectoryButton;
