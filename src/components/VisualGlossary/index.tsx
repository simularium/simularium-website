import * as React from "react";
import { Collapse } from "antd";

import visualGlossaryImage from "../../assets/visual-glossary.png";

const styles = require("./style.css");

const VisualGlossary: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <img src={visualGlossaryImage} />
            <Collapse>
                <Collapse.Panel header="Visual Glossary Key" key="1">
                    {/* TODO: Make this data driven so we can adjust either the
                    components being used or the number something corresponds to
                    without a lot of JSX editing */}
                    <ol className={styles.topLevelList}>
                        <li>
                            <b>LOAD MODEL MENU</b>
                            <br />
                            Use this menu to choose an example model to view, or
                            to select a file from your computer. You can also
                            load a file from your computer by dragging it into
                            the viewport.
                        </li>
                        <li>
                            <b>CLICK TO SELECT & FOLLOW ANY OBJECT</b>
                            <br />
                            Left mouse clicking on any object in the 3D viewport
                            will trigger the camera to point at it and to move
                            to a helpful viewing distance. The camera will
                            continue to Follow that object (outlined in bright
                            green) until another another is selected, or all
                            objects are deselected by clicking on an empty space
                            in the viewport’s background. It&apos;s easiest to
                            pause the playback before attempting to CLICK on an
                            object to follow.
                        </li>
                        <li>
                            <b>PLAYBACK CONTROLS, from left to right:</b>
                            <br />
                            <ul>
                                <li>STEP BACK: Step to the previous frame.</li>
                                <li>PLAY/PAUSE: Play or pause playback.</li>
                                <li>STEP FORWARD: Step to the next frame.</li>
                            </ul>
                        </li>
                        <li>
                            <b>TIMELINE</b>
                            <br />
                            Drag the PLAYHEAD dot to a specific point in the
                            trajectory file. Some buffering may occur, so please
                            be patient.
                        </li>
                        <li>
                            <b>TIME READOUT</b>
                            <br />
                            Displays the current and total simulated time.
                        </li>
                        <li>
                            <b>CAMERA CONTROLS, from top to bottom:</b>
                            <br />
                            <ul>
                                <li>
                                    ZOOM IN: Move the camera in towards the
                                    camera’s current target (either the center
                                    of the simulated volume by default, or a
                                    followed object).
                                </li>
                                <li>
                                    ZOOM OUT: Move the camera away from the
                                    camera’s target.
                                </li>
                                <li>
                                    RESET CAMERA: Reset the 3D camera to the
                                    default (original) position and orientation.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <b>SHOW / HIDE AGENTS</b>
                            <br />
                            Show or hide agents of the given type.
                        </li>
                        <li>
                            <b>HIGHLIGHT AGENTS</b>
                            <br />
                            Toggle highlighting on agents of the given type with
                            a white outline in the viewport.
                        </li>
                        <li>
                            <b>MENU TOGGLES</b>
                            <br />
                            Furl the side menus open or closed.
                        </li>
                    </ol>
                </Collapse.Panel>
            </Collapse>
        </div>
    );
};

export default VisualGlossary;
