import React, { KeyboardEvent, useState } from "react";
import { Button, Slider, Tooltip, InputNumber } from "antd";
import classNames from "classnames";
import { compareTimes } from "@aics/simularium-viewer";

import { TOOLTIP_COLOR } from "../../constants/index";
import Icons from "../Icons";
import { DisplayTimes } from "../../containers/ViewerPanel/types";
import { TimeUnits } from "../../state/trajectory/types";

import styles from "./style.css";
interface PlayBackProps {
    playHandler: (timeOverride?: number) => void;
    time: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    loopHandler: () => void;
    firstFrameTime: number;
    lastFrameTime: number;
    isPlaying: boolean;
    isLooping: boolean;
    onTimeChange: (time: number) => void;
    loading: boolean;
    timeStep: number;
    displayTimes: DisplayTimes;
    timeUnits: TimeUnits;
    isEmpty: boolean;
}

const PlayBackControls = ({
    time,
    playHandler,
    pauseHandler,
    prevHandler,
    loopHandler,
    isPlaying,
    isLooping,
    nextHandler,
    firstFrameTime,
    lastFrameTime,
    onTimeChange,
    loading,
    timeStep,
    displayTimes,
    timeUnits,
    isEmpty,
}: PlayBackProps): JSX.Element => {
    // Where to resume playing if simulation was playing before scrubbing
    const [timeToResumeAfterScrubbing, setTimeToResumeAfterScrubbing] =
        useState(-1);
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

    // Called after every keystroke
    const handleTimeInputChange = (userInput: number | null): void => {
        if (userInput !== null) {
            setTimeInput(userInput as number);
        }
    };

    const handleTimeInputKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Enter" || event.key === "Tab") {
            // User input will be aligned with the displayed time values, which were multiplied
            // by timeUnits.magnitude in the getDisplayTimes selector, so we have to undo the
            // multiplication before requesting the time. timeUnits.magnitude is 1 for a vast
            // majority of the time so it shouldn't make a difference most times.
            if (typeof timeInput === "number") {
                onTimeChange(timeInput / timeUnits.magnitude);
            }
        }
        if (event.key === "Escape") {
            const inputNumberComponent = event.target as HTMLElement;
            inputNumberComponent.blur();
        }
    };

    // Determine the width of the input box based on a likely max number of characters
    const getTimeInputWidth = (): string => {
        // If maxNumChars is 5 then the input box width will be 6 character widths long
        // (+ 1 is arbitrary padding)
        return `${displayTimes.maxNumChars + 1}ch`;
    };

    const btnClassNames = classNames([styles.item, styles.btn]);

    // Disable step back button if time - timeStep < firstFrameTime
    const isStepBackDisabled =
        compareTimes(time - timeStep, firstFrameTime, timeStep) === -1;
    // Disable step forward button if time + timeStep > lastFrameTime
    const isStepForwardDisabled =
        compareTimes(time + timeStep, lastFrameTime, timeStep) === 1;

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
                    disabled={isStepBackDisabled || loading || isEmpty}
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
                    disabled={isStepForwardDisabled || loading || isEmpty}
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
                tooltip={{ open: false }}
                className={[styles.slider, styles.item].join(" ")}
                step={timeStep}
                min={firstFrameTime}
                max={lastFrameTime}
                disabled={loading || isEmpty}
            />
            <div className={styles.time}>
                <InputNumber
                    // key is necessary to re-render this component and override user input
                    key={displayTimes.roundedTime}
                    size="small"
                    value={displayTimes.roundedTime}
                    onChange={handleTimeInputChange}
                    onKeyDown={handleTimeInputKeyDown}
                    disabled={loading || isEmpty || isPlaying}
                    style={{ width: getTimeInputWidth() }}
                />
                <span className={styles.lastFrameTime}>
                    / {displayTimes.roundedLastFrameTime}{" "}
                    {timeUnits ? timeUnits.name : "s"}
                </span>
            </div>
            <Tooltip
                placement="top"
                title={isLooping ? "Turn off looping" : "Turn on looping"}
                color={TOOLTIP_COLOR}
                arrowPointAtCenter
            >
                <Button
                    className={
                        isLooping
                            ? btnClassNames
                            : classNames([
                                  styles.item,
                                  styles.btn,
                                  styles.removeBorder,
                              ])
                    }
                    size="small"
                    icon={Icons.LoopOutlined}
                    onClick={loopHandler}
                    loading={loading}
                    disabled={isEmpty}
                />
            </Tooltip>
        </div>
    );
};
export default PlayBackControls;
