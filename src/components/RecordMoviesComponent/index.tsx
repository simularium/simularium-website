import React, { useEffect, useState } from "react";
import classNames from "classnames";

import RecordMoviesModal from "../RecordMoviesModal";
import ViewportButton from "../ViewportButton";

import styles from "./style.css";
import { useFormattedDuration } from "./useFormattedDuration";

interface RecordMovieComponentProps {
    movieUrl: string;
    movieTitle: string;
    resetAfterMovieRecording: () => void;
    startRecording: () => void;
    stopRecording: () => void;
}

const RecordMovieComponent = (props: RecordMovieComponentProps) => {
    const {
        movieUrl,
        movieTitle,
        resetAfterMovieRecording,
        startRecording,
        stopRecording,
    } = props;
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const supportedBrowser = "VideoEncoder" in window;

    const closeModal = () => {
        resetAfterMovieRecording();
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
        resetAfterMovieRecording();
    };

    /**
     * In this icon we are stacking glyphs to create multicolor icons via icomoon
     */
    const startRecordingIcon = (
        <span className={styles.iconContainer}>
            <span
                className={classNames("icon-moon", "record-icon-circle")}
            ></span>
            <span
                className={classNames("icon-moon", "record-icon-ring")}
            ></span>
        </span>
    );

    const activeRecordingIcon = (
        <div className={classNames([styles.redCircle, styles.animate])}></div>
    );

    const getIcon = () => {
        if (!isRecording) {
            return startRecordingIcon;
        } else if (isHovering) {
            return "stop-record-icon";
        } else return activeRecordingIcon;
    };

    const getTooltipText = () => {
        if (!supportedBrowser) {
            return "Feature not supported on this browser, please try using Chrome or Edge";
        } else if (isRecording) {
            return "Stop movie recording";
        }
        return "Start movie recording";
    };

    // /**
    //  * onloadedmetadata is async hence the need for this custom hook
    //  * to retrieve the duration from the recorded movie.
    //  */
    // export const useFormattedDuration = (movieUrl: string) => {
    //     const [formattedDuration, setFormattedDuration] = useState("");

    //     useEffect(() => {
    //         const video = document.createElement("video");
    //         video.src = movieUrl;
    //         video.onloadedmetadata = () => {
    //             const durationInSeconds = video.duration;
    //             const minutes = Math.floor((durationInSeconds % 3600) / 60);
    //             const secs = Math.ceil(durationInSeconds) % 60;

    //             const minutesStr = minutes.toString().padStart(2, "0");
    //             const secondsStr = secs.toString().padStart(2, "0");

    //             setFormattedDuration(`${minutesStr}:${secondsStr}`);
    //             video.src = "";
    //             video.load();
    //         };
    //     }, [movieUrl]);

    //     return formattedDuration;
    // };

    const duration = useFormattedDuration(movieUrl);

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
