import * as React from "react";
import { Button, Slider } from "antd";

import Icons from "../Icons";

const styles = require("./style.css");
interface PlayBackProps {
    playHandler: () => void;
    time: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    totalTime: number;
    isPlaying: boolean;
    onTimeChange: (time: number) => void;
}

const PlayBackControls = ({
    time,
    playHandler,
    pauseHandler,
    prevHandler,
    isPlaying,
    nextHandler,
    totalTime,
    onTimeChange,
}: PlayBackProps) => {
    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        onTimeChange(sliderValue as number); // slider can be a list of numbers, but we're just using a single value
    };

    const tipFormatter = (sliderValue: number): string => {
        if (!sliderValue) {
            return "";
        }
        const formatNumber = (num: number) => Number(num).toPrecision(3);
        const microSeconds = sliderValue / 1000;
        if (microSeconds > 1) {
            const milliseconds = microSeconds / 1000;
            if (milliseconds > 1) {
                return `${formatNumber(milliseconds)} ms`;
            }
            return `${formatNumber(microSeconds)} \u03BCs`;
        }
        return `${formatNumber(sliderValue)} ns`;
    };

    return (
        <div className={styles.container}>
            <Button
                className={styles.item}
                icon={Icons.StepBack}
                onClick={prevHandler}
                disabled={time === 0}
            />

            <Slider
                value={time}
                onChange={handleTimeChange}
                tipFormatter={tipFormatter}
                className={[styles.slider, styles.item].join(" ")}
                max={totalTime}
            />
            <Button
                className={styles.item}
                icon={isPlaying ? Icons.Pause : Icons.Play}
                onClick={isPlaying ? pauseHandler : playHandler}
            />
            <Button
                className={styles.item}
                icon={Icons.StepForward}
                onClick={nextHandler}
            />
        </div>
    );
};
export default PlayBackControls;
