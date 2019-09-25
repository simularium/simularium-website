import * as React from "react";
import { Button, Slider } from "antd";

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
    const sliderMax = totalTime / 1000;

    const convertSliderValueToNs = (sliderValue: number): number => {
        return (sliderValue / sliderMax) * totalTime;
    };

    const convertTimeToSliderValue = (): number => {
        return (time / totalTime) * sliderMax;
    };

    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        const time = convertSliderValueToNs(sliderValue as number);
        onTimeChange(time);
    };

    const tipFormatter = (sliderValue: number): string => {
        return `${sliderValue}k ns`;
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
                value={convertTimeToSliderValue()}
                onChange={handleTimeChange}
                tipFormatter={tipFormatter}
                className={[styles.slider, styles.item].join(" ")}
                max={sliderMax}
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
