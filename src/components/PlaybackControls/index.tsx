import React, { KeyboardEvent, useState } from "react";
import { Slider, InputNumber } from "antd";
import classNames from "classnames";
import { compareTimes } from "@aics/simularium-viewer";

import { DisplayTimes } from "../../containers/ViewerPanel/types";
import { TimeUnits } from "../../state/trajectory/types";
import { Pause, Play } from "../Icons";
import ViewportButton from "../ViewportButton";

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
    const handleTimeChange = (sliderValue: number): void => {
        onTimeChange(sliderValue);
        if (isPlaying) {
            // Need to save the sliderValue as timeToResumeAfterScrubbing to use in handleSliderMouseUp,
            // because the sliderValue argument available in handleSliderMouseUp is not accurate
            // when the time between mouse down and mouse up is short.
            setTimeToResumeAfterScrubbing(sliderValue);
            pauseHandler();
        } else if (timeToResumeAfterScrubbing >= 0) {
            // Update value if user is still dragging
            setTimeToResumeAfterScrubbing(sliderValue);
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

    // Disable step back button if time - timeStep < firstFrameTime
    const isStepBackDisabled =
        compareTimes(time - timeStep, firstFrameTime, timeStep) === -1;
    // Disable step forward button if time + timeStep > lastFrameTime
    const isStepForwardDisabled =
        compareTimes(time + timeStep, lastFrameTime, timeStep) === 1;

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <ViewportButton
                    tooltipText="Skip 1 frame back"
                    tooltipPlacement="top"
                    icon={"step-back-icon"}
                    clickHandler={prevHandler}
                    disabled={isStepBackDisabled || loading || isEmpty}
                    loading={loading}
                />
                <ViewportButton
                    tooltipText={isPlaying ? "Pause" : "Play"}
                    tooltipPlacement="top"
                    icon={isPlaying ? Pause : Play}
                    clickHandler={
                        isPlaying ? pauseHandler : () => playHandler()
                    }
                    disabled={isStepForwardDisabled || loading || isEmpty}
                    loading={loading}
                />
                <ViewportButton
                    tooltipText={"Skip 1 frame ahead"}
                    tooltipPlacement="top"
                    icon={"step-forward-icon"}
                    clickHandler={nextHandler}
                    disabled={isStepForwardDisabled || loading || isEmpty}
                    loading={loading}
                />
            </div>
            <Slider
                value={time}
                onChange={handleTimeChange}
                onAfterChange={handleSliderMouseUp}
                tooltip={{ open: false }}
                className={classNames(styles.slider, styles.item)}
                step={timeStep}
                min={firstFrameTime}
                max={lastFrameTime}
                disabled={loading || isEmpty}
                range={false}
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
            <ViewportButton
                tooltipText={isLooping ? "Turn off looping" : "Turn on looping"}
                tooltipPlacement="top"
                icon={"looping-icon"}
                clickHandler={loopHandler}
                disabled={isEmpty}
                active={isLooping}
                loading={loading}
            />
        </div>
    );
};
export default PlayBackControls;
