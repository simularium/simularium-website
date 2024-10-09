import React, { KeyboardEvent, useState } from "react";
import { Slider, InputNumber } from "antd";
import classNames from "classnames";
import { compareTimes } from "@aics/simularium-viewer";

import { DisplayTimes } from "../../containers/ViewerPanel/types";
import { TimeUnits } from "../../state/trajectory/types";
import { IconGlyphs } from "../../constants/interfaces";
import { getIconGlyphClasses } from "../../util";
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
    const [timeInput, setTimeInput] = useState(firstFrameTime);

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
                    icon={getIconGlyphClasses(IconGlyphs.StepBack)}
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
                    disabled={loading || isEmpty}
                    loading={loading}
                />
                <ViewportButton
                    tooltipText={"Skip 1 frame ahead"}
                    tooltipPlacement="top"
                    icon={getIconGlyphClasses(IconGlyphs.StepForward)}
                    clickHandler={nextHandler}
                    disabled={isStepForwardDisabled || loading || isEmpty}
                    loading={loading}
                />
            </div>
            <Slider
                value={time}
                onChange={onTimeChange}
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
                icon={getIconGlyphClasses(IconGlyphs.Loop)}
                clickHandler={loopHandler}
                disabled={isEmpty}
                active={isLooping}
                loading={loading}
            />
        </div>
    );
};
export default PlayBackControls;
