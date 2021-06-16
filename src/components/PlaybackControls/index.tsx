import React, { useState } from "react";
import { Button, Slider, Tooltip, InputNumber } from "antd";
import classNames from "classnames";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";
import { DisplayTimes } from "../../containers/ViewerPanel/types";

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
    displayTimes: DisplayTimes;
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
    displayTimes,
    isEmpty,
}: PlayBackProps) => {
    // Where to resume playing if simulation was playing before scrubbing
    const [
        timeToResumeAfterScrubbing,
        setTimeToResumeAfterScrubbing,
    ] = useState(-1);
    const [timeInput, setTimeInput] = useState(firstFrameTime);

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

    const handleTimeInputChange = (
        timeInput: number | string | undefined
    ): void => {
        if (timeInput !== undefined) {
            setTimeInput(timeInput as number);
        }
    };

    const handleTimeInputEnter = (): void => {
        onTimeChange(timeInput as number);
    };

    const inputNumberWidth =
        Math.min(displayTimes.roundedLastFrameTime.toString().length + 5, 7) +
        "ch";

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
                    disabled={
                        time - timeStep < firstFrameTime || loading || isEmpty
                    }
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
                    disabled={
                        time + timeStep > lastFrameTime || loading || isEmpty
                    }
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
                <InputNumber
                    // Necessary to re-render this component and override user input
                    key={displayTimes.roundedTime}
                    size="small"
                    value={displayTimes.roundedTime}
                    onChange={handleTimeInputChange}
                    onPressEnter={handleTimeInputEnter}
                    disabled={loading || isEmpty || isPlaying}
                    style={{ width: inputNumberWidth }}
                />
                <span className={styles.lastFrameTime}>
                    / {displayTimes.roundedLastFrameTime}{" "}
                    {displayTimes.unitLabel}
                </span>
            </div>
        </div>
    );
};
export default PlayBackControls;
