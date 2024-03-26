import React, { useEffect, useState } from "react";
import classNames from "classnames";

import RecordMoviesModal from "../RecordMoviesModal";
import ViewportButton from "../ViewportButton";

import styles from "./style.css";

interface RecordMovieComponentProps {
    movieUrl: string;
    movieTitle: string;
    cleanupMovieState: () => void;
    startRecording: () => void;
    stopRecording: () => void;
}

const RecordMovieComponent = (props: RecordMovieComponentProps) => {
    const {
        movieUrl,
        movieTitle,
        cleanupMovieState,
        startRecording,
        stopRecording,
    } = props;
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const supportedBrowser = "VideoEncoder" in window;

    const closeModal = () => {
        cleanupMovieState();
        setModalVisible(false);
    };

    const start = () => {
        setIsRecording(true);
        startRecording();
    };

    const stop = () => {
        setIsRecording(false);
        stopRecording();
        setModalVisible(true);
    };

    const downloadMovie = () => {
        if (!movieUrl) {
            console.error("No recorded movie to download");
            return;
        }
        const anchor = document.createElement("a");
        anchor.href = movieUrl;
        anchor.download = movieTitle;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        cleanupMovieState();
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

    const useFormattedDuration = () => {
        const [formattedDuration, setFormattedDuration] = useState("");

        useEffect(() => {
            const video = document.createElement("video");
            video.src = movieUrl;
            video.onloadedmetadata = () => {
                const durationInSeconds = video.duration;
                const minutes = Math.floor((durationInSeconds % 3600) / 60);
                const secs = Math.ceil(durationInSeconds) % 60;

                const minutesStr = minutes.toString().padStart(2, "0");
                const secondsStr = secs.toString().padStart(2, "0");

                setFormattedDuration(`${minutesStr}:${secondsStr}`);
                video.src = "";
                video.load();
            };
        }, [movieUrl]);

        return formattedDuration;
    };

    const duration = useFormattedDuration();

    return (
        <div className={styles.record}>
            {modalVisible && (
                <RecordMoviesModal
                    closeModal={closeModal}
                    downloadMovie={downloadMovie}
                    duration={duration}
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
