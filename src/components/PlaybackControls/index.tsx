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

    const formatTime = (): JSX.Element | null => {
        if (!totalTime) {
            return null;
        }
        /*
        All incoming times are in seconds, but we want to determine the best unit for displaying.
        
        Here we determine the most appropriate unit by calculating how many times (rounded up) the inverse of
        totalTime can divide by 1000. Math.log(x) / Math.log(1000) is the same as log base 1000 of x:
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log/#Examples
        */
        const units = ["s", "ms", "\u03BCs", "ns"];
        let unitIndex = Math.ceil(Math.log(1 / totalTime) / Math.log(1000));
        // Use nanoseconds if totalTime is less than 1 ns
        if (unitIndex >= units.length) {
            unitIndex = units.length - 1;
        }

        const unit = units[unitIndex];
        const roundNumber = (num: number) => Number(num).toPrecision(3);
        const roundedTime = time ? roundNumber(time * 1000 ** unitIndex) : 0;
        const roundedTotalTime = roundNumber(totalTime * 1000 ** unitIndex);
        return (
            <p>
                {roundedTime}{" "}
                <span className={styles.totalTime}>
                    / {roundedTotalTime} {unit}
                </span>
            </p>
        );
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
                tooltipVisible={false}
                className={[styles.slider, styles.item].join(" ")}
                step={timeStep}
                max={totalTime}
                disabled={loading}
            />
            <div className={styles.time}>{formatTime()}</div>
        </div>
    );
};
export default PlayBackControls;
