import React from "react";
import { Input, Checkbox, Button } from "antd";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import VerticalFlexbox from "../../styles/utils";
import { getUrlParamValue, copyToClipboard } from "../../util";
import { DownArrow } from "../Icons";

import styles from "./style.css";

const DEFAULT_WIDTH = 834;
const DEFAULT_HEIGHT = 480;
const MAX_WIDTH = 3840;
const MAX_HEIGHT = 2160;

interface EmbedSnippetPanelProps {
    startTime: number;
}

const EmbedSnippetPanel = ({ startTime }: EmbedSnippetPanelProps) => {
    const trajectory = getUrlParamValue(
        window.location.href,
        URL_PARAM_KEY_FILE_NAME
    );

    const [width, setWidth] = React.useState(DEFAULT_WIDTH);
    const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
    const [constrainProportions, setConstrainProportions] =
        React.useState(false);

    const [showEmbedSettingsPanel, setShowEmbedSettingsPanel] =
        React.useState(false);

    const url = `https://simularium.allencell.org/embed?trajFileName=${trajectory}&t=${startTime}`;
    const embedSnippet = `<iframe height="${width}" width="${height}" src="${url}" title="Simularium" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    const inputIsValid = (input: string) => {
        return !Number.isNaN(parseInt(input));
    };

    const handleChangeWidth = (input: string) => {
        const currentRatio = width / height;
        const numericInput = inputIsValid(input) ? parseInt(input) : width;
        const roundedLimitedInput = Math.min(MAX_WIDTH, numericInput);
        setWidth(roundedLimitedInput);
        if (constrainProportions) {
            setHeight(Math.round(roundedLimitedInput / currentRatio));
        }
    };

    const handleChangeHeight = (input: string) => {
        const currentRatio = width / height;

        const numericInput = inputIsValid(input) ? parseInt(input) : height;
        const roundedLimitedInput = Math.min(MAX_HEIGHT, numericInput);
        setHeight(roundedLimitedInput);
        if (constrainProportions) {
            setWidth(Math.round(roundedLimitedInput * currentRatio));
        }
    };

    return (
        <VerticalFlexbox gap={8}>
            <div className={styles.embedHeader}>
                <h4>Embed &lt;/&gt;</h4>
                <button
                    className={styles.settingsButton}
                    onClick={() => {
                        setShowEmbedSettingsPanel(!showEmbedSettingsPanel);
                    }}
                >
                    Show settings {DownArrow}
                </button>
            </div>
            {showEmbedSettingsPanel && (
                <div className={styles.embedSettings}>
                    <VerticalFlexbox gap={4}>
                        <p className={styles.accentText}> Size </p>
                        <VerticalFlexbox gap={24}>
                            <div className={styles.proportionSettings}>
                                {" "}
                                <Input
                                    defaultValue={height}
                                    className={styles.numberInputs}
                                    onChange={(e) => {
                                        handleChangeHeight(e.target.value);
                                    }}
                                />
                                <span> x </span>
                                <Input
                                    value={width}
                                    className={styles.numberInputs}
                                    onChange={(e) => {
                                        handleChangeWidth(e.target.value);
                                    }}
                                />
                                <label> pixels </label>
                                <label className={styles.constrainProportions}>
                                    <Checkbox
                                        onChange={() => {
                                            setConstrainProportions(
                                                !constrainProportions
                                            );
                                        }}
                                    ></Checkbox>
                                    Constrain proportions
                                </label>
                            </div>
                        </VerticalFlexbox>
                    </VerticalFlexbox>
                </div>
            )}
            <VerticalFlexbox gap={8} alignItems="end">
                <Input.TextArea
                    className={styles.embedInput}
                    value={embedSnippet}
                    disabled
                />
                <Button
                    className={"primary-button"}
                    onClick={() => copyToClipboard(embedSnippet)}
                >
                    Copy
                </Button>
            </VerticalFlexbox>
        </VerticalFlexbox>
    );
};

export default EmbedSnippetPanel;
