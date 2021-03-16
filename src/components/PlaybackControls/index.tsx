import React, { useEffect, useState } from "react";
import { Button, Slider, Tooltip } from "antd";
import classNames from "classnames";

import { TimeUnits } from "../../state/metadata/types";
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
    timeUnits: TimeUnits;
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
    timeUnits,
    isEmpty,
}: PlayBackProps) => {
    const [unitLabel, setUnitLabel] = useState("s");
    const [unitIndex, setUnitIndex] = useState(0);

    // Where to resume playing if simulation was playing before scrubbing
    const [
        timeToResumeAfterScrubbing,
        setTimeToResumeAfterScrubbing,
    ] = useState(-1);

    // Sets display unit when a new trajectory is loaded
    useEffect(() => {
        // V1 data format
        if (!timeUnits) {
            console.log("no timeUnits, calculating unit");
            if (!lastFrameTime) return;

            const units = ["s", "ms", "\u03BCs", "ns"];
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
            setUnitLabel(units[unitIndex]);
        } else {
            // V2 data format
            setUnitLabel(timeUnits.name);
        }
    }, [timeUnits, lastFrameTime]);

    // - Gets called once when the user clicks on the slider to skip to a specific time
    // - Gets called multiple times when user is scrubbing (every time the play head
    //     passes through a time value associated with a frame)
    const handleTimeChange = (sliderValue: number | [number, number]): void => {
        // sliderValue can be an array of numbers (representing a selected range),
        // but we're just using a single value
        onTimeChange(sliderValue as number);
        if (isPlaying) {
            // Need to save the sliderValue as timeToResumeAfterScrubbing to use in handleSliderMouseUp,
            // because the sliderValue argument available in handleSliderMouseUp is not accurate
            // when the time between mouse down and mouse up is short.
            setTimeToResumeAfterScrubbing(sliderValue as number);
            pauseHandler();
        } else if (timeToResumeAfterScrubbing >= 0) {
            // Update value if user is still dragging
            setTimeToResumeAfterScrubbing(sliderValue as number);
        }
    };

    const handleSliderMouseUp = (): void => {
        // Resume playing if simulation was playing before
        if (timeToResumeAfterScrubbing >= 0) {
            playHandler(timeToResumeAfterScrubbing);
            setTimeToResumeAfterScrubbing(-1);
        }
    };

    const roundNumber = (num: number) => parseFloat(Number(num).toPrecision(3));

    let roundedTime = 0;
    let roundedLastFrameTime = 0;

    if (timeUnits === null) {
        roundedTime = time ? roundNumber(time * 1000 ** unitIndex) : 0;
        roundedLastFrameTime = roundNumber(lastFrameTime * 1000 ** unitIndex);
    } else {
        roundedTime = time ? roundNumber(time * timeUnits.magnitude) : 0;
        roundedLastFrameTime = roundNumber(lastFrameTime * timeUnits.magnitude);
    }

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
                    disabled={time === firstFrameTime || loading}
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
                value={time}
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
                        / {roundedLastFrameTime} {unitLabel}
                    </span>
                </p>
            </div>
        </div>
    );
};
export default PlayBackControls;
