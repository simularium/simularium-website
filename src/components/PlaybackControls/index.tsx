import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Slider, InputNumber } from "antd";
import classNames from "classnames";

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
    currentFrame: number;
    pauseHandler: () => void;
    prevHandler: () => void;
    nextHandler: () => void;
    loopHandler: () => void;
    isPlaying: boolean;
    isLooping: boolean;
    goToFrame: (frame: number) => void;
    loading: boolean;
    timeStep: number;
    displayTimes: DisplayTimes;
    timeUnits: TimeUnits;
    isEmpty: boolean;
    displayType: PlaybackControlsDisplay;
    resetCamera: () => void;
    cacheRange: number[];
    numFrames: number;
}

const PlayBackControls = ({
    currentFrame,
    playHandler,
    pauseHandler,
    prevHandler,
    loopHandler,
    isPlaying,
    isLooping,
    nextHandler,
    loading,
    timeStep,
    displayTimes,
    timeUnits,
    isEmpty,
    displayType,
    resetCamera,
    cacheRange,
    numFrames,
    goToFrame,
}: PlayBackProps): JSX.Element => {
    const [cacheMinMax, setCacheMinMax] = useState([0, 0]);
    const [localPlaybackFrame, setLocalPlaybackFrame] = useState(0);
    const [frameInput, setFrameInput] = useState(0);

    const isDraggingRef = useRef(false);
    const wasPlayingWhenDragStartedRef = useRef(false);

    useEffect(() => {
        setCacheMinMax([cacheRange[0], cacheRange[cacheRange.length - 1]]);
    }, [cacheRange]);

    // keep slider handle in sync with state when not dragging
    useEffect(() => {
        if (!isDraggingRef.current) {
            setLocalPlaybackFrame(currentFrame);
        }
    }, [currentFrame]);

    const handleSliderChange = (value: number) => {
        if (!isDraggingRef.current) {
            isDraggingRef.current = true;
            wasPlayingWhenDragStartedRef.current = isPlaying;
            if (isPlaying) {
                pauseHandler();
            }
        }
        setLocalPlaybackFrame(value);
        goToFrame(value);
    };

    const handleSliderAfterChange = () => {
        isDraggingRef.current = false;
        goToFrame(localPlaybackFrame);
        if (wasPlayingWhenDragStartedRef.current) {
            wasPlayingWhenDragStartedRef.current = false;
            playHandler();
        }
    };

    const handleTimeInputChange = (userInput: number | null): void => {
        if (userInput !== null) {
            const adjustedTime = userInput / timeUnits.magnitude;
            const frameFloat = adjustedTime / timeStep;
            const frame = Math.round(frameFloat);

            // Clamp the frame number to valid range
            const clampedFrame = Math.max(0, Math.min(frame, numFrames));
            setFrameInput(clampedFrame);
        }
    };

    const handleTimeInputKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Enter" || event.key === "Tab") {
            if (typeof frameInput === "number") {
                goToFrame(frameInput);
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

    const globalDisabled = loading || isEmpty;

    const PlayPauseButton = (
        <ViewportButton
            tooltipText={isPlaying ? "Pause" : "Play"}
            tooltipPlacement="top"
            icon={isPlaying ? Pause : Play}
            onClick={isPlaying ? () => pauseHandler() : () => playHandler()}
            disabled={globalDisabled}
            loading={loading}
        />
    );

    const TimeSlider = (
        <div className={styles.sliderContainer}>
            {/* This slider has a handle to change playback head */}
            <Slider
                range={false}
                value={localPlaybackFrame}
                min={0}
                max={numFrames}
                onChange={handleSliderChange}
                onChangeComplete={handleSliderAfterChange}
                step={1}
                tooltip={{ open: false }}
                className={classNames(styles.slider, styles.playbackSlider)}
            />
            {/* This is just for display and shows the range of cached frames */}
            <Slider
                range
                value={[cacheMinMax[0], cacheMinMax[1]]}
                min={0}
                max={numFrames}
                step={1}
                tooltip={{ open: false }}
                className={classNames(styles.slider, styles.cacheSlider)}
            />
        </div>
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
                    disabled={currentFrame <= 0 || globalDisabled}
                    loading={loading}
                />
                {PlayPauseButton}
                <ViewportButton
                    tooltipText="Skip 1 frame ahead"
                    tooltipPlacement="top"
                    icon={getIconGlyphClasses(IconGlyphs.StepForward)}
                    onClick={nextHandler}
                    disabled={currentFrame >= numFrames - 1 || globalDisabled}
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
                    disabled={globalDisabled || isPlaying}
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
