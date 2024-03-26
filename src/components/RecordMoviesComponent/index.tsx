import React, { useState } from "react";
import classNames from "classnames";

import RecordMoviesModal from "../RecordMoviesModal";
import ViewportButton from "../ViewportButton";

import styles from "./style.css";

interface RecordMovieComponentProps {
    trajectoryTitle: string;
    movieDuration: number;
    downloadMovie: () => void;
    startRecording: () => void;
    stopRecording: () => void;
}

const RecordMovieComponent = (props: RecordMovieComponentProps) => {
    const { movieDuration, downloadMovie, startRecording, stopRecording } =
        props;
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const supportedBrowser = "VideoEncoder" in window;

    const start = () => {
        setIsRecording(true);
        startRecording();
    };

    const stop = () => {
        setIsRecording(false);
        stopRecording();
        setModalVisible(true);
    };

    const startRecordIcon = (
        <span className={styles.iconContainer}>
            <span
                className={classNames("icon-moon", "record-icon-circle")}
            ></span>
            <span
                className={classNames("icon-moon", "record-icon-ring")}
            ></span>
        </span>
    );

    const getTooltipText = () => {
        if (!supportedBrowser) {
            return "Feature not supported on this browser, please try using Chrome or Edge";
        } else if (isRecording) {
            return "Stop movie recording";
        } else {
            return "Start movie recording";
        }
    };

    const getIcon = () => {
        const stopIcon = isHovering ? (
            "stop-record-icon"
        ) : (
            <div
                className={classNames([styles.redCircle, styles.animate])}
            ></div>
        );
        return isRecording ? stopIcon : startRecordIcon;
    };

    return (
        <div className={styles.record}>
            {modalVisible && (
                <RecordMoviesModal
                    setModalVisible={setModalVisible}
                    downloadMovie={downloadMovie}
                    duration={movieDuration}
                />
            )}
            <ViewportButton
                tooltipPlacement="top"
                tooltipWhenDisabled={true}
                tooltipText={getTooltipText()}
                icon={getIcon()}
                clickHandler={isRecording ? stop : start}
                disabled={!supportedBrowser}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            />
            <div className={styles.statusContainer}>
                {isRecording && (
                    <div className={styles.recordingStatus}>Recording...</div>
                )}
            </div>
        </div>
    );
};

export default RecordMovieComponent;
