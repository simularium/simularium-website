import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import { useHotkeys, useIsHotkeyPressed } from "react-hotkeys-hook";

import { TOOLTIP_COLOR } from "../../constants/index";
import { ZoomIn, ZoomOut } from "../Icons";

import styles from "./style.css";

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
}

const CameraControls = ({
    resetCamera,
    zoomIn,
    zoomOut,
    setPanningMode,
    setFocusMode,
    setCameraType,
}: CameraControlsProps): JSX.Element => {
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
    return (
        <div className={styles.container}>
            <div className={styles.zoomButtons}>
                <Tooltip
                    placement="left"
                    title="Zoom in ( &uarr; )"
                    color={TOOLTIP_COLOR}
                >
                    <Button
                        className={styles.btn}
                        icon={ZoomIn}
                        onClick={zoomIn}
                    />
                </Tooltip>
                <Tooltip
                    placement="left"
                    title="Zoom out ( &darr; )"
                    color={TOOLTIP_COLOR}
                >
                    <Button
                        className={styles.btn}
                        icon={ZoomOut}
                        onClick={zoomOut}
                    />
                </Tooltip>
            </div>
            <div className={styles.moveButtons}>
                <div className={styles.radioGroup}>
                    <Tooltip
                        placement="left"
                        title={
                            mode === ROTATE ? "Rotate" : "Rotate (hold SHIFT)"
                        }
                        color={TOOLTIP_COLOR}
                    >
                        {/* Should be radio buttons, but using radio buttons 
                        detaches keypressed listener after the button is pressed */}
                        <Button
                            className={classNames([
                                { [styles.active]: mode === ROTATE },
                                styles.radioBtn,
                            ])}
                            onClick={() => setMode(ROTATE)}
                        >
                            <span
                                className={classNames([
                                    "icon-moon",
                                    "anticon",
                                    "rotate-icon",
                                ])}
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        placement="left"
                        title={mode === PAN ? "Pan" : "Pan (hold SHIFT)"}
                        color={TOOLTIP_COLOR}
                    >
                        <Button
                            className={classNames([
                                { [styles.active]: mode === PAN },
                                styles.radioBtn,
                            ])}
                            onClick={() => setMode(PAN)}
                        >
                            <span
                                className={classNames([
                                    "icon-moon",
                                    "anticon",
                                    "pan-icon",
                                ])}
                            />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.moveButtons}>
                <div className={styles.radioGroup}>
                    <Tooltip
                        placement="left"
                        title={"Orthographic Camera"}
                        color={TOOLTIP_COLOR}
                    >
                        {/* Should be radio buttons, but using radio buttons 
                        detaches keypressed listener after the button is pressed */}
                        <Button
                            className={classNames([
                                {
                                    [styles.active]:
                                        cameraProjectionType === ORTHOGRAPHIC,
                                },
                                styles.radioBtn,
                            ])}
                            onClick={() => {
                                setCameraProjectionType(ORTHOGRAPHIC);
                            }}
                            icon={
                                <span
                                    className={classNames([
                                        "icon-moon",
                                        "anticon",
                                        "orthographic-icon",
                                    ])}
                                />
                            }
                        ></Button>
                    </Tooltip>
                    <Tooltip
                        placement="left"
                        title={"Perspective Camera"}
                        color={TOOLTIP_COLOR}
                    >
                        <Button
                            className={classNames([
                                {
                                    [styles.active]:
                                        cameraProjectionType === PERSPECTIVE,
                                },
                                styles.radioBtn,
                            ])}
                            onClick={() => {
                                setCameraProjectionType(PERSPECTIVE);
                            }}
                            icon={
                                <span
                                    className={classNames([
                                        "icon-moon",
                                        "anticon",
                                        "perspective-icon",
                                    ])}
                                />
                            }
                        ></Button>
                    </Tooltip>
                </div>
            </div>
            <Tooltip placement="left" title="Focus (F)" color={TOOLTIP_COLOR}>
                <Button
                    className={classNames([
                        { [styles.active]: isFocused },
                        styles.radioBtn,
                    ])}
                    onClick={() => {
                        saveFocusMode(!isFocused);
                    }}
                >
                    <span
                        className={classNames([
                            "icon-moon",
                            "anticon",
                            "focus-icon",
                        ])}
                    />
                </Button>
            </Tooltip>
            <Tooltip
                placement="left"
                title="Home view (H)"
                color={TOOLTIP_COLOR}
            >
                <Button
                    className={styles.btn}
                    icon={
                        <span
                            className={classNames([
                                "icon-moon",
                                "anticon",
                                "reset-icon",
                            ])}
                        />
                    }
                    onClick={resetCamera}
                />
            </Tooltip>
        </div>
    );
};
export default CameraControls;
