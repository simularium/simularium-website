import React from "react";
import { Button, Tooltip } from "antd";

import { TOOLTIP_COLOR } from "../../constants";
import { NetworkedSimFile, LocalSimFile } from "../../state/trajectory/types";
import { Share } from "../Icons";

import styles from "./style.css";
import ShareModal from "../ShareModal";

interface ShareButtonProps {
    isBuffering: boolean;
    simulariumFile: LocalSimFile | NetworkedSimFile;
}

const ShareButton = ({
    isBuffering,
    simulariumFile,
}: ShareButtonProps): JSX.Element => {
    const [isSharing, setIsSharing] = React.useState(false);

    const checkLocalOrNetworked = (
        file: LocalSimFile | NetworkedSimFile
    ): file is LocalSimFile => {
        return (file as LocalSimFile).lastModified !== undefined;
    };

    const isLocalFile = checkLocalOrNetworked(simulariumFile);

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
                        <ShareModal
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

export default ShareButton;
