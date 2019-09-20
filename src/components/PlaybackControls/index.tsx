import React from "react";
import { Button } from "antd";

const styles = require("./style.css");

interface PlayBackProps {
    playHandler: () => void;
    time: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    isPlaying: boolean;
}

const PlayBackControls = ({
    time,
    playHandler,
    pauseHandler,
    prevHandler,
    isPlaying,
    nextHandler,
}: PlayBackProps) => {
    return (
        <div className={styles.container}>
            <Button
                icon={isPlaying ? "pause" : "caret-right"}
                onClick={isPlaying ? pauseHandler : playHandler}
            >
                {isPlaying ? "Pause" : "Play"}{" "}
            </Button>
            <Button
                icon="step-backward"
                onClick={prevHandler}
                disabled={time === 0}
            >
                Back{" "}
            </Button>
            <Button icon="step-forward" onClick={nextHandler}>
                Forward{" "}
            </Button>
        </div>
    );
};
export default PlayBackControls;
