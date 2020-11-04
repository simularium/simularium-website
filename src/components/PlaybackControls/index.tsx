import * as React from "react";
import { Button, Slider, Tooltip } from "antd";
import classNames from "classnames";

import { TOOLTIP_COLOR } from "../../constants/index";
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
    loading: boolean;
    timeStep: number;
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
    loading,
    timeStep,
}: PlayBackProps) => {
    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        onTimeChange(sliderValue as number); // slider can be a list of numbers, but we're just using a single value
    };

    const tipFormatter = (
        sliderValue?: number | undefined
    ): React.ReactNode => {
        if (!sliderValue) {
            return null;
        }
        const formatNumber = (num: number) => Number(num).toPrecision(3);
        const microSeconds = sliderValue / 1000;
        if (microSeconds > 1) {
            const milliseconds = microSeconds / 1000;
            if (milliseconds > 1) {
                const seconds = milliseconds / 1000;
                if (seconds > 1) {
                    return `${formatNumber(seconds)} s`;
                }
                return `${formatNumber(milliseconds)} ms`;
            }
            return `${formatNumber(microSeconds)} \u03BCs`;
        }
        return `${formatNumber(sliderValue)} ns`;
    };
    const btnClassNames = classNames([styles.item, styles.btn]);

    return (
        <div className={styles.container}>
            <Tooltip
                placement="top"
                title="Skip 1 frame back"
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={[btnClassNames, styles.stepButton].join(" ")}
                    size="small"
                    icon={Icons.StepBack}
                    onClick={prevHandler}
                    disabled={time === 0 || loading}
                    loading={loading}
                />
            </Tooltip>
            <Tooltip
                placement="top"
                title={isPlaying ? "Pause" : "Play"}
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={btnClassNames}
                    size="small"
                    icon={isPlaying ? Icons.Pause : Icons.Play}
                    onClick={isPlaying ? pauseHandler : playHandler}
                    loading={loading}
                />
            </Tooltip>
            <Tooltip
                placement="top"
                title="Skip 1 frame ahead"
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={[btnClassNames, styles.stepButton].join(" ")}
                    size="small"
                    icon={Icons.StepForward}
                    onClick={nextHandler}
                    disabled={time + timeStep >= totalTime || loading}
                    loading={loading}
                />
            </Tooltip>
            <Slider
                value={time}
                onChange={handleTimeChange}
                // This ternary expression prevents an empty tooltip when time is undefined
                tipFormatter={time ? tipFormatter : null}
                className={[styles.slider, styles.item].join(" ")}
                step={timeStep}
                max={totalTime}
                disabled={loading}
            />
        </div>
    );
};
export default PlayBackControls;
