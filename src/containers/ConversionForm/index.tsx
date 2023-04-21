import React, { useState } from "react";
import { Divider, Upload, Select, Button } from "antd";
import classNames from "classnames";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { UploadFile } from "antd/lib/upload";

import theme from "../../components/theme/light-theme.css";
import { State } from "../../state";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
} from "../../state/trajectory/types";
import { SetErrorAction } from "../../state/viewer/types";
import {
    AvailableEngines,
    CustomType,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";

import styles from "./style.css";
import customRequest from "./custom-request";

import OptionalInputs from "../../components/ConversionOptionalInputs";

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

const ConversionForm = ({
    setConversionEngine,
    conversionProcessingData,
    setError,
    receiveFileToConvert,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile>();
    // TODO: use conversion template data to render the form
    console.log("conversion form data", conversionProcessingData);
    return (
        <div className={classNames(styles.container, theme.lightTheme)}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Import a non-native file type</h1>
                <h3 className={styles.subTitle}>
                    Convert and import a non-simularium file by providing the
                    following information.
                </h3>
                <div className={styles.required}>
                    <h2 className={styles.sectionTitle}>
                        Provide file information (required){" "}
                    </h2>
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
                </div>
                <OptionalInputs {...conversionProcessingData} />
                <Button ghost>Cancel</Button>
                <Button type="primary" disabled={!fileToConvert}>
                    {fileToConvert ? "Import" : "Next"}
                </Button>
            </div>
        </div>
    );
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
