import React from "react";
import { Icon, Button } from "antd";

const WHITE_SMOKE = "#eee";
const GRAY = "#878c88";
const GREEN = "#72d687";

interface PlayBackProps {
    playHandler: () => void;
    time: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    isPlaying: boolean;
}

const PlayBackControls = ({
    playHandler,
    time,
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
            <Button icon="step-backward" onClick={prevHandler}>
                Back{" "}
            </Button>
            <Button icon="step-forward" onClick={nextHandler}>
                Forward{" "}
            </Button>
        </React.Fragment>
    );
};
export default PlayBackControls;
