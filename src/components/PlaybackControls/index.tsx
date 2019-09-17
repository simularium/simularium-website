import React from "react";
import { Button, Slider } from "antd";
import { ChangeTimeAction } from "../../state/selection/types";
import { ActionCreator } from "redux";

const styles = require("./style.css");

interface PlayBackProps {
    playHandler: () => void;
    time: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    isPlaying: boolean;
    onTimeChange: ActionCreator<ChangeTimeAction>;
}

const PlayBackControls = ({
    time,
    playHandler,
    pauseHandler,
    prevHandler,
    isPlaying,
    onTimeChange,
    nextHandler,
}: PlayBackProps) => {
    const convertSliderValueToNs = (sliderValue: number): number => {
        return sliderValue * 10000;
    };

    const convertTimeToSliderValue = (time: number): number => {
        return time / 10000;
    };

    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        const time = convertSliderValueToNs(sliderValue as number);
        onTimeChange(time);
    };

    const tipFormatter = (time: number): string => {
        return `${time / 1000}k ns`;
    };
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
            <Slider
                value={convertTimeToSliderValue(time)}
                onChange={handleTimeChange}
                tipFormatter={tipFormatter}
            />
        </div>
    );
};
export default PlayBackControls;
