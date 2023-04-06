import React, { useState } from "react";
import { Upload, Select, Divider, Button } from "antd";
import classNames from "classnames";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import theme from "../../components/theme/light-theme.css";
import { State } from "../../state";
import trajectoryStateBranch from "../../state/trajectory";
import {
    AvailableEngines,
    SetConversionEngineAction,
} from "../../state/trajectory/types";

import styles from "./style.css";

interface ConversionProps {
    setConversionEngine: ActionCreator<SetConversionEngineAction>;
}

const selectOptions = Object.keys(AvailableEngines).map((engineName) => ({
    label: engineName,
    value: engineName,
}));

const ConversionForm = ({
    setConversionEngine,
}: ConversionProps): JSX.Element | null => {
    const [isFileLoaded, setFileLoaded] = useState<boolean>(false);

    const conversionForm = (
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
            <h3 className={styles.selectTitle}>Simulation Engine</h3>
            <div className={styles.uploadContainer}>
                <Select
                    className={styles.selectorBox}
                    bordered={true}
                    defaultValue="Select"
                    options={selectOptions}
                    onChange={(value) => {
                        console.log("select value: " + value);
                        setConversionEngine(value);
                    }}
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

    return conversionForm;
};

function mapStateToProps(state: State) {
    return {};
}

const dispatchToPropsMap = {
    setConversionEngine: trajectoryStateBranch.actions.setConversionEngine,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
