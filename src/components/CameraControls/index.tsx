import React, { useEffect, useState, useRef } from "react";
import { useHotkeys, useIsHotkeyPressed } from "react-hotkeys-hook";

import { IconGlyphs } from "../../constants/interfaces";
import { getIconGlyphClasses } from "../../util";
import { ZoomIn, ZoomOut } from "../Icons";
import ViewportButton from "../ViewportButton";

import styles from "./style.css";
import { CameraControlsDisplay } from "../../containers/ViewerPanel/types";
import CameraHomeButton from "./CameraHomeButton";

const PAN = "pan";
const ROTATE = "rotate";
const ORTHOGRAPHIC = "o";
const PERSPECTIVE = "p";
const CAMERA_MODE_MODIFIER_KEYS = ["Meta", "Shift"];
const ZOOM_IN_HK = "ArrowUp";
const ZOOM_OUT_HK = "ArrowDown";
const RESET_HK = "h";
const FOCUS_HK = "f";
const HOT_KEYS = [
    ZOOM_IN_HK,
    ZOOM_OUT_HK,
    RESET_HK,
    FOCUS_HK,
    ORTHOGRAPHIC,
    PERSPECTIVE,
];

interface CameraControlsProps {
    resetCamera: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    setPanningMode: (value: boolean) => void;
    setFocusMode: (value: boolean) => void;
    setCameraType: (value: boolean) => void;
    displayType: CameraControlsDisplay;
}

const CameraControls = ({
    resetCamera,
    zoomIn,
    zoomOut,
    setPanningMode,
    setFocusMode,
    setCameraType,
    displayType,
}: CameraControlsProps): JSX.Element | null => {
    const [isFocused, saveFocusMode] = useState(true);
    const [mode, setMode] = useState(ROTATE);
    const [cameraProjectionType, setCameraProjectionType] =
        useState(PERSPECTIVE);
    const [keyPressed, setKeyPressed] = useState("");
    const lastKeyPressed = useRef("");

    const isModifierKey = (key: string) =>
        CAMERA_MODE_MODIFIER_KEYS.includes(key);

    const getModifierKeyPressed = () => {
        const isPressed = useIsHotkeyPressed();

        return CAMERA_MODE_MODIFIER_KEYS.reduce((acc, key) => {
            if (isPressed(key)) {
                acc = key;
            }
            return acc;
        }, "");
    };

    useHotkeys(
        "*",
        (event) => {
            if (
                CAMERA_MODE_MODIFIER_KEYS.includes(event.key) ||
                HOT_KEYS.includes(event.key)
            ) {
                return setKeyPressed(event.key);
            }
        },
        { keydown: true }
    );

    useHotkeys(
        "*",
        () => {
            const currentModifierKeyPressed = getModifierKeyPressed();
            if (!!currentModifierKeyPressed) {
                return setKeyPressed(currentModifierKeyPressed);
            }
            return setKeyPressed("");
        },
        { keyup: true }
    );

    useEffect(() => {
        setFocusMode(isFocused);
    }, [isFocused]);

    useEffect(() => {
        if (
            !isModifierKey(lastKeyPressed.current) &&
            !isModifierKey(keyPressed)
        ) {
            // only call the simularium controller if it's not a modifier key
            // because the viewer is already setting the mode
            setPanningMode(mode === PAN);
        }
    }, [mode]);

    useEffect(() => {
        setCameraType(cameraProjectionType === ORTHOGRAPHIC);
    }, [cameraProjectionType]);

    useEffect(() => {
        if (
            (isModifierKey(keyPressed) && !lastKeyPressed.current) ||
            (isModifierKey(lastKeyPressed.current) && !keyPressed)
        ) {
            // toggle the mode, so the radio buttons reflect the true state
            lastKeyPressed.current = keyPressed;
            return setMode(mode === PAN ? ROTATE : PAN);
        }
        switch (keyPressed) {
            case ZOOM_IN_HK:
                zoomIn();
                break;
            case ZOOM_OUT_HK:
                zoomOut();
                break;
            case RESET_HK:
                resetCamera();
                break;
            case FOCUS_HK:
                saveFocusMode(!isFocused);
                break;
            case ORTHOGRAPHIC:
                setCameraProjectionType(ORTHOGRAPHIC);
                break;
            case PERSPECTIVE:
                setCameraProjectionType(PERSPECTIVE);
                break;
            default:
                break;
        }
        lastKeyPressed.current = keyPressed;
    }, [keyPressed]);

    const minimalControlsContainer = (
        <div className={styles.container}>
            <CameraHomeButton resetCamera={resetCamera} />
        </div>
    );

    const fullControls = (
        <div className={styles.container}>
            <div className={styles.zoomGroup}>
                <ViewportButton
                    tooltipText="Zoom in ( &uarr; )"
                    tooltipPlacement="left"
                    icon={ZoomIn}
                    onClick={zoomIn}
                />
                <ViewportButton
                    tooltipText="Zoom out ( &darr; )"
                    tooltipPlacement="left"
                    icon={ZoomOut}
                    onClick={zoomOut}
                />
            </div>
            <div className={styles.radioGroup}>
                <ViewportButton
                    tooltipText={
                        mode === ROTATE ? "Rotate" : "Rotate (hold SHIFT)"
                    }
                    tooltipPlacement="left"
                    icon={getIconGlyphClasses(IconGlyphs.Rotate)}
                    radioGroupPosition={"top"}
                    onClick={() => setMode(ROTATE)}
                    active={mode === ROTATE}
                />
                <ViewportButton
                    tooltipText={mode === PAN ? "Pan" : "Pan (hold SHIFT)"}
                    tooltipPlacement="left"
                    icon={getIconGlyphClasses(IconGlyphs.Pan)}
                    radioGroupPosition={"bottom"}
                    onClick={() => setMode(PAN)}
                    active={mode === PAN}
                />
            </div>
            <ViewportButton
                tooltipText={"Focus (F)"}
                tooltipPlacement="left"
                icon={getIconGlyphClasses(IconGlyphs.Focus)}
                onClick={() => {
                    saveFocusMode(!isFocused);
                }}
                active={isFocused}
            />
            <div className={styles.radioGroup}>
                <ViewportButton
                    tooltipText={"Orthographic Camera"}
                    tooltipPlacement="left"
                    icon={getIconGlyphClasses(IconGlyphs.Orthographic)}
                    radioGroupPosition={"top"}
                    onClick={() => {
                        setCameraProjectionType(ORTHOGRAPHIC);
                    }}
                    active={cameraProjectionType === ORTHOGRAPHIC}
                />
                <ViewportButton
                    tooltipText={"Perspective Camera"}
                    tooltipPlacement="left"
                    icon={getIconGlyphClasses(IconGlyphs.Perspective)}
                    radioGroupPosition={"bottom"}
                    onClick={() => {
                        setCameraProjectionType(PERSPECTIVE);
                    }}
                    active={cameraProjectionType === PERSPECTIVE}
                />
            </div>
            <CameraHomeButton resetCamera={resetCamera} />
        </div>
    );

    if (displayType === CameraControlsDisplay.None) {
        return null;
    } else if (displayType === CameraControlsDisplay.Min) {
        return minimalControlsContainer;
    } else {
        return fullControls;
    }
};
export default CameraControls;
