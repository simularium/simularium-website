import React, { KeyboardEvent, useEffect, useState } from "react";
import { Slider, InputNumber } from "antd";
import classNames from "classnames";
import { compareTimes } from "@aics/simularium-viewer";

import {
    DisplayTimes,
    PlaybackControlsDisplay,
} from "../../containers/ViewerPanel/types";
import { TimeUnits } from "../../state/trajectory/types";
import { IconGlyphs } from "../../constants/interfaces";
import { getIconGlyphClasses } from "../../util";
import { Pause, Play } from "../Icons";
import ViewportButton from "../ViewportButton";
import CameraHomeButton from "../CameraControls/CameraHomeButton";

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
    displayType: PlaybackControlsDisplay;
    resetCamera: () => void;
    cacheRange: number[];
    currentFrame: number;
    numFrames: number;
    goToFrame: (frame: number) => void;
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
    displayType,
    resetCamera,
    cacheRange,
    currentFrame,
    numFrames,
    goToFrame,
}: PlayBackProps): JSX.Element => {
    // Where to resume playing if simulation was playing before scrubbing
    const [frameToResumeAfterScrubbing, setFrameToResumeAfterScrubbing] =
        useState(-1);
    const [timeInput, setTimeInput] = useState(firstFrameTime);
    const [frameRange, setFrameRange] = useState([0, 0, 0]);

    // Keep slider range values in sync with global state
    useEffect(() => {
        const firstCachedFrame = cacheRange[0];
        const lastCachedFrame = cacheRange[cacheRange.length - 1];
        setFrameRange([firstCachedFrame, currentFrame, lastCachedFrame]);
    }, [currentFrame, cacheRange]);

    const handleSliderChange = (newVals: number[]) => {
        const oldVals = frameRange;

        // Clicking different parts of the slider track will try to update
        // one of the three handle values, depending where the current range is.
        // We want the event value always assigned to the visible "playback" handle.
        const diff0 = Math.abs(newVals[0] - oldVals[0]);
        const diff1 = Math.abs(newVals[1] - oldVals[1]);
        const diff2 = Math.abs(newVals[2] - oldVals[2]);
        let largestDiffIndex = 0;
        let largestDiffValue = diff0;
        if (diff1 > largestDiffValue) {
            largestDiffIndex = 1;
            largestDiffValue = diff1;
        }
        if (diff2 > largestDiffValue) {
            largestDiffIndex = 2;
            largestDiffValue = diff2;
        }

        // Apply value to middle handle, lock the outer handles
        const newMiddle = newVals[largestDiffIndex];
        const newFirst = oldVals[0];
        const newLast = oldVals[2];
        const lockedVals = [newFirst, newMiddle, newLast];

        setFrameRange(lockedVals);
        handleFrameChange(newMiddle);
    };

    // - Gets called once when the user clicks on the slider to skip to a specific frame
    // - Gets called multiple times when user is scrubbing (every time the play head
    //     passes through a time value associated with a frame)
    const handleFrameChange = (frame: number): void => {
        goToFrame(frame);
        if (isPlaying) {
            // set frame to resume
            setFrameToResumeAfterScrubbing(frame);
            pauseHandler();
        } else if (frameToResumeAfterScrubbing >= 0) {
            // Update value if user is still dragging
            setFrameToResumeAfterScrubbing(frame);
        }
    };

    const handleSliderMouseUp = (): void => {
        // Resume playing if simulation was playing before
        if (frameToResumeAfterScrubbing >= 0) {
            goToFrame(frameToResumeAfterScrubbing);
            setFrameToResumeAfterScrubbing(-1);
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

    const PlayPauseButton = (
        <ViewportButton
            tooltipText={isPlaying ? "Pause" : "Play"}
            tooltipPlacement="top"
            icon={isPlaying ? Pause : Play}
            onClick={isPlaying ? () => pauseHandler() : () => playHandler()}
            disabled={loading || isEmpty}
            loading={loading}
        />
    );

    const TimeSlider = (
        <Slider
            range
            value={frameRange}
            min={0}
            max={numFrames}
            onChange={handleSliderChange}
            onChangeComplete={handleSliderMouseUp}
            step={1}
            tooltip={{ open: false }}
            className={classNames(styles.slider)}
        />
    );

    const minimalControlsContainer = (
        <div className={styles.minimalControlsContainer}>
            {PlayPauseButton}
            {TimeSlider}
            {displayType === PlaybackControlsDisplay.BottomOnly && (
                <div className={styles.buttonContainer}>
                    <CameraHomeButton resetCamera={resetCamera} />
                </div>
            )}
        </div>
    );

    const fullControls = (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <ViewportButton
                    tooltipText="Skip 1 frame back"
                    tooltipPlacement="top"
                    icon={getIconGlyphClasses(IconGlyphs.StepBack)}
                    onClick={prevHandler}
                    disabled={isStepBackDisabled || loading || isEmpty}
                    loading={loading}
                />
                {PlayPauseButton}
                <ViewportButton
                    tooltipText="Skip 1 frame ahead"
                    tooltipPlacement="top"
                    icon={getIconGlyphClasses(IconGlyphs.StepForward)}
                    onClick={nextHandler}
                    disabled={isStepForwardDisabled || loading || isEmpty}
                    loading={loading}
                />
            </div>
            {TimeSlider}
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
                icon={getIconGlyphClasses(IconGlyphs.Loop)}
                onClick={loopHandler}
                disabled={isEmpty}
                active={isLooping}
                loading={loading}
            />
        </div>
    );

    return (
        <div className={styles.container}>
            {displayType === PlaybackControlsDisplay.Full
                ? fullControls
                : minimalControlsContainer}
        </div>
    );
};

export default PlayBackControls;
