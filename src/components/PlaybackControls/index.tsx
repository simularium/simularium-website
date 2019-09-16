import React from "react";
import { Button } from "antd";

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
        <React.Fragment>
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
        </React.Fragment>
    );
};
export default PlayBackControls;
