import * as React from "react";
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
    nextHandler,
    totalTime,
    onTimeChange,
}: PlayBackProps) => {
    const SLIDER_MAX = totalTime / 1000;

    const convertSliderValueToNs = (sliderValue: number): number => {
        return (sliderValue / SLIDER_MAX) * totalTime;
    };

    const convertTimeToSliderValue = (): number => {
        return (time / totalTime) * SLIDER_MAX;
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
                max={SLIDER_MAX}
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
