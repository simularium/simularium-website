import React, { useState } from "react";
import { Upload, Select, Divider, Button, Input, Collapse } from "antd";
import classNames from "classnames";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import theme from "../../components/theme/light-theme.css";
import { State } from "../../state";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
} from "../../state/trajectory/types";
import {
    AvailableEngines,
    CustomType,
    DownloadedTemplate,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";

import styles from "./style.css";
import customRequest from "./custom-request";
import { SetErrorAction } from "../../state/viewer/types";
import { UploadFile } from "antd/lib/upload";

import InputForm from "../../components/ConversionFormFromViewer";

const { Panel } = Collapse;

interface ConversionProps {
    setConversionEngine: ActionCreator<SetConversionEngineAction>;
    conversionProcessingData: {
        template: CustomType;
        templateMap: TemplateMap;
        preConvertedFile: string;
        engineType: AvailableEngines;
    };
    receiveFileToConvert: ActionCreator<ReceiveFileToConvertAction>;
    setError: ActionCreator<SetErrorAction>;
}

const selectOptions = Object.keys(AvailableEngines).map(
    (engineName: string, index) => {
        const values = Object.values(AvailableEngines);
        return {
            label: engineName,
            value: values[index],
        };
    }
);

const dividerMargin = window.innerWidth * 0.18;

const ConversionForm = ({
    setConversionEngine,
    conversionProcessingData,
    setError,
    receiveFileToConvert,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile>();
    // TODO: use conversion template data to render the form
    console.log("conversion form data", conversionProcessingData);
    const conversionForm = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            <h3 className={styles.title}>Import a non-native file type</h3>
            <h3>
                Convert and import a non-simularium file by providing the
                following information.
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
                    onChange={setConversionEngine}
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
                    onChange={({ file }) => {
                        setFileToConvert(file);
                    }}
                    customRequest={(options) =>
                        customRequest(
                            fileToConvert,
                            receiveFileToConvert,
                            setError,
                            options
                        )
                    }
                >
                    <Button type="default">Select file</Button>
                </Upload>
            </div>
            <Divider
                className={styles.divider}
                orientation="right"
                orientationMargin={dividerMargin}
            >
                {" "}
            </Divider>
            {/* this div needs conditional rendering when Next button is hit */}
            {fileToConvert ? (
                <div>
                    <h3 className={styles.provide}>
                        Provide display information (optional)
                    </h3>
                    <h3>
                        You can import your model now with defaults, or specify
                        how you want your Smoldyn trajectory displayed below.
                    </h3>
                    <h3 className={styles.provide}> </h3>
                    <h3 className={styles.selecttitle}>Trajectory title</h3>
                    <Input placeholder="Start typing..." />
                    <Divider
                        className={styles.divider}
                        orientation="right"
                        orientationMargin={dividerMargin}
                    >
                        {" "}
                    </Divider>
                </div>
            ) : null}
            {conversionProcessingData.templateMap ? (
                <InputForm
                    conversionProcessingData={conversionProcessingData}
                />
            ) : null}
            <Button ghost>Cancel</Button>
            <Button type="primary" disabled={!fileToConvert}>
                {fileToConvert ? "Import" : "Next"}
            </Button>
        </div>
    );

    return conversionForm;
};

function mapStateToProps(state: State) {
    return {
        conversionProcessingData:
            trajectoryStateBranch.selectors.getConversionProcessingData(state),
    };
}

const dispatchToPropsMap = {
    receiveFileToConvert: trajectoryStateBranch.actions.receiveFileToConvert,
    setError: viewerStateBranch.actions.setError,
    setConversionEngine: trajectoryStateBranch.actions.setConversionEngine,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
