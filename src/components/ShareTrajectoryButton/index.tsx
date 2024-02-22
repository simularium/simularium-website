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
    const [tooltipVisible, setTooltipVisible] = React.useState(false);

    const trajectoryIsSharable = isOnlineTrajectory(location.href);

    const handleShare = () => {
        setIsSharing(!isSharing);
        // this is to ensure the tooltip closes when the button is clicked
        setTooltipVisible(false);
    };

    const isDisabled = !simulariumFile.name || isSharing || isBuffering;
    // disabled buttons are wrapped in a span which changes the tooltip offset
    const tooltipOffset = isDisabled ? [0, -20] : [0, -8];

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
                    !simulariumFile.name
                        ? "Load a model to perform this action"
                        : "Share trajectory"
                }
                placement="bottomLeft"
                color={TOOLTIP_COLOR}
                align={{ offset: tooltipOffset }}
                mouseEnterDelay={0.5}
                trigger={isSharing ? [] : ["hover"]}
                onOpenChange={(visible) => {
                    setTooltipVisible(visible);
                }}
                open={tooltipVisible}
            >
                <Button
                    className={isDisabled ? styles.disabled : undefined}
                    type="primary"
                    disabled={isDisabled}
                    onClick={handleShare}
                >
                    Share {Share}
                </Button>
            </Tooltip>
        </div>
    );
};

export default ShareTrajectoryButton;
