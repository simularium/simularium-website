import React from "react";
import { Button, Tooltip } from "antd";

import { TOOLTIP_COLOR } from "../../constants";
import {
    NetworkedSimFile,
    LocalSimFile,
    isLocalFileInterface,
} from "../../state/trajectory/types";
import { Share } from "../Icons";

import styles from "./style.css";
import ShareTrajectoryModal from "../ShareTrajectoryModal";

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
        setIsSharing(true);
    };

    const closeModal = () => {
        setIsSharing(false);
    };

    return (
        <div className={styles.container}>
            <Tooltip
                title={
                    isSharing
                        ? null
                        : !simulariumFile.name
                        ? null
                        : "Share this trajectory"
                }
                placement="left"
                color={TOOLTIP_COLOR}
                open={
                    isSharing ? false : !simulariumFile.name ? false : undefined
                }
            >
                {isSharing ? (
                    <div className={styles.overlay}>
                        <ShareTrajectoryModal
                            isLocalFile={isLocalFile}
                            closeModal={closeModal}
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
