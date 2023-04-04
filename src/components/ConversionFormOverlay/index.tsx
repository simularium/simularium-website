import React, { useState } from "react";
import { Upload, Select, Divider, Button } from "antd";

import styles from "./style.css";
import theme from "../theme/light-theme.css";
import classNames from "classnames";

interface ConversionFormOverlayProps {
    [key: string]: any;
    active: boolean;
}

const selectOptions = [
    { value: "cytosim", label: "cytosim" },
    { value: "cellPACK", label: "cellPACK" },
    { value: "Smoldyn", label: "Smoldyn" },
    { value: "SpringSaLaD", label: "SpringSaLaD" },
];

const ConversionFormOverlay =
    ({}: ConversionFormOverlayProps): JSX.Element | null => {
        const [isFileLoaded, setFileLoaded] = useState<boolean>(false);

        const conversionFormOverlay = (
            <div className={classNames(styles.container, theme.lightTheme)}>
                <h3 className={styles.title}>Import a non-native file type</h3>
                <h3>
                    Convert and import a non-simularium file by providing the
                    following information
                </h3>
                <h3 className={styles.provide}>
                    {" "}
                    Provide file information (required){" "}
                </h3>
                <h3 className={styles.selecttitle}>Simulation Engine</h3>
                <div className={styles.uploadContainer}>
                    <Select
                        className={styles.selectorBox}
                        bordered={true}
                        defaultValue="Select"
                        options={selectOptions}
                    />
                    <Upload
                        className={styles.upload}
                        listType="text"
                        multiple={false}
                        showUploadList={{
                            showPreviewIcon: false,
                            showDownloadIcon: false,
                            showRemoveIcon: true,
                        }}
                        onChange={() => {
                            setFileLoaded(true);
                        }}
                    >
                        <Button type="default">Select file</Button>
                    </Upload>
                </div>
                <Divider orientation="right" orientationMargin={400}>
                    {" "}
                </Divider>
                <Button ghost>Cancel</Button>
                <Button type="primary" disabled={!isFileLoaded}>
                    Next
                </Button>
            </div>
        );

        return conversionFormOverlay;
    };

export default ConversionFormOverlay;
