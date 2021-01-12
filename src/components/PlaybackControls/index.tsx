import React, { useEffect, useState } from "react";
import { Button, Slider, Tooltip } from "antd";
import classNames from "classnames";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";

const styles = require("./style.css");
interface PlayBackProps {
    playHandler: (timeOverride?: number) => void;
    time: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    firstFrameTime: number;
    lastFrameTime: number;
    isPlaying: boolean;
    onTimeChange: (time: number) => void;
    loading: boolean;
    timeStep: number;
    isEmpty: boolean;
}

const PlayBackControls = ({
    time,
    playHandler,
    pauseHandler,
    prevHandler,
    isPlaying,
    nextHandler,
    firstFrameTime,
    lastFrameTime,
    onTimeChange,
    loading,
    timeStep,
    isEmpty,
}: PlayBackProps) => {
    const [unitIndex, setUnitIndex] = useState(0);
    const [wasPlaying, setWasPlaying] = useState(false);
    const [targetPlayTime, setTargetPlayTime] = useState(-1);

    // - Gets called once when the user clicks on the slider to skip to a specific time
    // - Gets called multiple times when user is scrubbing (every time the play head
    //     passes through a time value associated with a frame)
    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        // sliderValue can be an array of numbers (representing a selected range),
        // but we're just using a single value
        setTargetPlayTime(sliderValue as number);
        if (isPlaying) {
            setWasPlaying(true);
            pauseHandler();
        }
    };

    const handleSliderMouseUp = (): void => {
        // Resume playing at targetPlayTime if simulation was playing before,
        // otherwise just skip to targetPlayTime without resuming.
        if (wasPlaying) {
            playHandler(targetPlayTime);
            setWasPlaying(false);
        } else {
            onTimeChange(targetPlayTime);
        }
        setTargetPlayTime(-1);
    };

    const units = ["s", "ms", "\u03BCs", "ns"];
    const roundNumber = (num: number) => parseFloat(Number(num).toPrecision(3));
    const displayTime = targetPlayTime >= 0 ? targetPlayTime : time;
    const roundedTime = displayTime
        ? roundNumber(displayTime * 1000 ** unitIndex)
        : 0;
    const roundedLastFrameTime = roundNumber(lastFrameTime * 1000 ** unitIndex);

    // Calculates display unit when lastFrameTime is updated, i.e., when a new trajectory is loaded
    useEffect(() => {
        if (!lastFrameTime) return;
        /*
        All incoming times are in seconds, but we want to determine the best unit for displaying.
        
        Here we determine the most appropriate unit by calculating how many times (rounded up) the inverse of
        lastFrameTime can divide by 1000. Math.log(x) / Math.log(1000) is the same as log base 1000 of x:
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log/#Examples
        */
        let index = Math.ceil(Math.log(1 / lastFrameTime) / Math.log(1000));

        // Handle very small values (use ns if lastFrameTime is less than 1 ns)
        if (index >= units.length) {
            index = units.length - 1;
            // Handle very large values (use s if lastFrameTime is greater than 1000 s)
        } else if (index < 0) {
            index = 0;
        }

        setUnitIndex(index);
    }, [lastFrameTime]);

    const btnClassNames = classNames([styles.item, styles.btn]);

    return (
        <div className={styles.container}>
            <Tooltip
                placement="top"
                title="Skip 1 frame back"
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={classNames([
                        btnClassNames,
                        { [styles.customStepButton]: !loading },
                    ])}
                    size="small"
                    onClick={prevHandler}
                    disabled={time === 0 || loading}
                    loading={loading}
                >
                    {/* if loading, antd will show loading icon, otherwise, show our custom svg */}
                    {!loading && (
                        <span
                            className={classNames([
                                "icon-moon",
                                "anticon",
                                styles.stepBack,
                            ])}
                        />
                    )}
                </Button>
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
                    onClick={isPlaying ? pauseHandler : () => playHandler()}
                    loading={loading}
                    disabled={isEmpty}
                />
            </Tooltip>
            <Tooltip
                placement="top"
                title="Skip 1 frame ahead"
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={classNames([
                        btnClassNames,
                        { [styles.customStepButton]: !loading },
                    ])}
                    size="small"
                    onClick={nextHandler}
                    disabled={time + timeStep >= lastFrameTime || loading}
                    loading={loading}
                >
                    {/* if loading, antd will show loading icon, otherwise, show our custom svg */}
                    {!loading && (
                        <span
                            className={classNames([
                                "icon-moon",
                                "anticon",
                                styles.stepForward,
                            ])}
                        />
                    )}
                </Button>
            </Tooltip>
            <Slider
                value={targetPlayTime >= 0 ? targetPlayTime : time}
                onChange={handleTimeChange}
                onAfterChange={handleSliderMouseUp}
                tooltipVisible={false}
                className={[styles.slider, styles.item].join(" ")}
                step={timeStep}
                min={firstFrameTime}
                max={lastFrameTime}
                disabled={loading || isEmpty}
            />
            <div className={styles.time}>
                <p>
                    {roundedTime}{" "}
                    <span className={styles.lastFrameTime}>
                        / {roundedLastFrameTime} {units[unitIndex]}
                    </span>
                </p>
            </div>
        </div>
    );
};
export default PlayBackControls;
