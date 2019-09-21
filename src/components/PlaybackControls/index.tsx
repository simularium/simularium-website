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
    totalTime: number;
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
    totalTime,
}: PlayBackProps) => {
    const convertSliderValueToNs = (sliderValue: number): number => {
        const totalNs = totalTime * 10000;
        return (sliderValue / 100) * totalNs;
    };

    const convertTimeToSliderValue = (time: number): number => {
        const totalNs = totalTime * 10000;

        return (time / totalNs) * 100;
    };

    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        const time = convertSliderValueToNs(sliderValue as number);
        onTimeChange(time);
    };

    const tipFormatter = (sliderValue: number): string => {
        const totalNs = totalTime * 10000;
        return `${((sliderValue / 100) * totalNs) / 1000} ns`;
    };

    return (
        <div className={styles.container}>
            <Button
                className={styles.item}
                icon="step-backward"
                onClick={prevHandler}
                disabled={time === 0}
            />

            <Slider
                value={convertTimeToSliderValue(time)}
                onChange={handleTimeChange}
                tipFormatter={tipFormatter}
                className={[styles.slider, styles.item].join(" ")}
            />
            <Button
                className={styles.item}
                icon={isPlaying ? "pause" : "caret-right"}
                onClick={isPlaying ? pauseHandler : playHandler}
            />
            <Button
                className={styles.item}
                icon="step-forward"
                onClick={nextHandler}
            />
        </div>
    );
};
export default PlayBackControls;
