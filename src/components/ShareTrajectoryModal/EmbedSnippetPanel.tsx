import React from "react";
import classNames from "classnames";
import { Input, Checkbox } from "antd";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { copyToClipboard } from "../../util";
import { getUrlParamValue } from "../../util/userUrlHandling";
import { ButtonClass } from "../../constants/interfaces";
import { DownArrow, UpArrow } from "../Icons";
import { VerticalFlexbox, HorizontalFlexbox } from "../FlexboxUtility";
import { CustomButton } from "../CustomButton";

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

    const url = `${location.origin}/embed?trajFileName=${trajectory}&t=${startTime}`;
    const embedSnippet = `<iframe width="${width}" height="${height}" src="${url}" title="Simularium" allow="accelerometer; autoplay; clipboard-write; encrypted-media; frameBorder="0"; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
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

    const getSettingsButtonText = () => {
        return showEmbedSettingsPanel ? (
            <>Hide settings {UpArrow}</>
        ) : (
            <>Show settings {DownArrow}</>
        );
    };

    return (
        <>
            <VerticalFlexbox gap={8}>
                <div className={styles.embedHeader}>
                    <h4>Embed &lt;/&gt;</h4>
                    <button
                        className={styles.settingsButton}
                        onClick={() => {
                            setShowEmbedSettingsPanel(!showEmbedSettingsPanel);
                        }}
                    >
                        {getSettingsButtonText()}
                    </button>
                </div>
                <div
                    className={classNames(styles.embedSettings, {
                        [styles.open]: showEmbedSettingsPanel,
                    })}
                >
                    {showEmbedSettingsPanel && (
                        <VerticalFlexbox gap={4}>
                            <h5 className={styles.accentText}> Size </h5>
                            <VerticalFlexbox gap={24}>
                                <HorizontalFlexbox gap={8} alignItems="center">
                                    <Input
                                        value={width}
                                        className={styles.numberInputs}
                                        onChange={(e) => {
                                            handleChangeWidth(e.target.value);
                                        }}
                                    />
                                    <span> x </span>
                                    <Input
                                        value={height}
                                        className={styles.numberInputs}
                                        onChange={(e) => {
                                            handleChangeHeight(e.target.value);
                                        }}
                                    />
                                    <label> pixels </label>
                                    <label
                                        className={styles.constrainProportions}
                                    >
                                        <Checkbox
                                            onChange={() => {
                                                setConstrainProportions(
                                                    !constrainProportions
                                                );
                                            }}
                                        ></Checkbox>
                                        Constrain proportions
                                    </label>
                                </HorizontalFlexbox>
                            </VerticalFlexbox>
                        </VerticalFlexbox>
                    )}
                </div>
                <VerticalFlexbox gap={8} alignItems="end">
                    <Input.TextArea
                        className={styles.embedInput}
                        value={embedSnippet}
                        disabled
                    />
                    <CustomButton
                        variant={ButtonClass.LightPrimary}
                        onClick={() => copyToClipboard(embedSnippet)}
                    >
                        Copy
                    </CustomButton>
                </VerticalFlexbox>
            </VerticalFlexbox>
        </>
    );
};

export default EmbedSnippetPanel;
