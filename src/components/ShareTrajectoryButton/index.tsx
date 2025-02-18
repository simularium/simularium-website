import React from "react";

import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { isOnlineTrajectory } from "../../util/userUrlHandling";
import { ButtonClass } from "../../constants/interfaces";
import { Share } from "../Icons";
import ShareTrajectoryModal from "../ShareTrajectoryModal";
import { TooltipButton } from "../CustomButton";

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
            <TooltipButton
                variant={ButtonClass.Action}
                tooltipPlacement="bottomLeft"
                titleText="Share"
                icon={Share}
                onClick={handleShare}
                disabled={isDisabled}
                tooltipText={{
                    defaultText: "Share trajectory",
                    disabledText: "Load a model to perform this action",
                }}
            />
        </>
    );
};

export default ShareTrajectoryButton;
