import { VisualGlossaryItem } from "./interfaces";

const visualGlossary: VisualGlossaryItem[] = [
    {
        label: "LOAD MODEL MENU",
        description:
            "Use this menu to choose an example model to view, or to select a file from a public cloud URL or from your local computer. You can also load a file locally from your computer by dragging it into the viewport.",
    },
    {
        label: "CAMERA CONTROLS, from top to bottom:",
        description: "",
        bulletItems: [
            "ROTATE: When this mode is active, click and drag to rotate the view in 3D. This mode is active by default.",
            "PAN: When this mode is active, click and drag to pan around the view.",
            "FOCUS: When this mode is active, the selected agent becomes the camera target and gets centered in the view. This mode is active by default.",
            "ZOOM IN: Move the camera in towards the camera’s current target (either the camera look at position by default, or a followed object).",
            "ZOOM OUT: Move the camera away from the camera’s target.",
            "RESET CAMERA: Reset the 3D camera to the default (original) position and orientation.",
        ],
    },
    {
        label: "CAMERA CONTROLS, from top to bottom:",
        description: "",
        bulletItems: [
            "ROTATE: When this mode is active, click and drag to rotate the view in 3D. This mode is active by default.",
            "PAN: When this mode is active, click and drag to pan around the view.",
            "FOCUS: When this mode is active, the selected agent becomes the camera target and gets centered in the view. This mode is active by default.",
            "ZOOM IN: Move the camera in towards the camera’s current target (either the camera look at position by default, or a followed object).",
            "ZOOM OUT: Move the camera away from the camera’s target.",
            "RESET CAMERA: Reset the 3D camera to the default (original) position and orientation.",
        ],
    },
    {
        label: "PLAYBACK CONTROLS, from left to right:",
        description: "",
        bulletItems: [
            "STEP BACK: Step to the previous frame.",
            "PLAY/PAUSE: Play or pause playback.",
            "STEP FORWARD: Step to the next frame.",
        ],
    },
    {
        label: "TIMELINE",
        description:
            "Drag the PLAYHEAD dot to a specific point in the trajectory file. Some buffering may occur, so please be patient.",
    },
    {
        label: "TIME READOUT",
        description: "Displays the current and total simulated time.",
    },
    {
        label: "SCALE BAR",
        description:
            "Displays the distance between tickmarks on the bounding box.",
    },
    {
        label: "SHOW / HIDE AGENTS",
        description: "Show or hide agents of the given type.",
    },
    {
        label: "HIGHLIGHT AGENTS",
        description:
            "Toggle highlighting on agents of the given type with a white outline in the viewport.",
    },
    {
        label: "MENU TOGGLES",
        description: "Furl the side menus open or closed.",
    },
];

export default visualGlossary;
