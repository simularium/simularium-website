import React, { useEffect, useState } from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Upload, Select, Divider, Button } from "antd";
import { UploadFile } from "antd/lib/upload";
import classNames from "classnames";

import { State } from "../../state";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    ConversionStatus,
    InitializeConversionAction,
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
} from "../../state/trajectory/types";
import { SetErrorAction } from "../../state/viewer/types";
import {
    AvailableEngines,
    ExtensionMap,
    Template,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";
import ConversionServerErrorModal from "../../components/ConversionServerErrorModal";
import ConversionProcessingOverlay from "../../components/ConversionProcessingOverlay";
import ConversionFileErrorModal from "../../components/ConversionFileErrorModal";
import { Cancel, DownCaret } from "../../components/Icons";
import { CONVERSION_NO_SERVER } from "../../state/trajectory/constants";
import customRequest from "./custom-request";

import theme from "../../components/theme/light-theme.css";
import styles from "./style.css";

interface ConversionProps {
    setConversionEngine: ActionCreator<SetConversionEngineAction>;
    conversionProcessingData: {
        template: Template;
        templateMap: TemplateMap;
        fileToConvert: string;
        engineType: AvailableEngines;
    };
    receiveFileToConvert: ActionCreator<ReceiveFileToConvertAction>;
    setError: ActionCreator<SetErrorAction>;
    initializeConversion: ActionCreator<InitializeConversionAction>;
    conversionStatus: ConversionStatus;
}

const validFileExtensions: ExtensionMap = {
    // TODO: update this with correct extensions
    Smoldyn: "txt",
    cytosim: "txt",
    cellPACK: "txt",
    SpringSaLaD: "txt",
};

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
    initializeConversion,
    conversionStatus,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile | null>();
    const [engineSelected, setEngineSelected] = useState<boolean>(false);
    const [serverDownModalOpen, setServerIsDownModalOpen] =
        useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [fileTypeErrorModalOpen, setFileTypeErrorModalOpen] = useState(false);

    useEffect(() => {
        initializeConversion();
    }, []);

    // TODO delete after development, useEffect to log a change in server health
    useEffect(() => {
        console.log(conversionStatus);
    }, [conversionStatus]);

    // callbacks for state variables
    const toggleServerCheckModal = () => {
        setServerIsDownModalOpen(!serverDownModalOpen);
    };

    const toggleFileTypeModal = () => {
        setFileTypeErrorModalOpen(!fileTypeErrorModalOpen);
    };

    const toggleProcessing = () => {
        setIsProcessing(!isProcessing);
    };

    const handleEngineChange = (selectedValue: string) => {
        const selectedEngine = selectedValue as AvailableEngines;
        setConversionEngine(selectedEngine);
        setEngineSelected(true);
    };

    const handleRemoveFile = () => {
        setFileToConvert(null);
    };

    const handleFileSelection = async (file: UploadFile) => {
        setFileToConvert(file);
        customRequest(file, receiveFileToConvert, setError);
    };

    const validateFileType = (fileName: string) => {
        const fileExtension = fileName.split(".").pop();
        if (fileExtension) {
            if (
                validFileExtensions[conversionProcessingData.engineType] ===
                fileExtension.toLowerCase()
            ) {
                return true;
            }
        }

        setFileTypeErrorModalOpen(true);
        return false;
    };

    const advanceIfServerIsHealthy = () => {
        if (
            engineSelected &&
            fileToConvert &&
            validateFileType(fileToConvert.name)
        ) {
            if (conversionStatus === CONVERSION_NO_SERVER) {
                setServerIsDownModalOpen(true);
            } else {
                // at this point: engine selected, file uploaded, file type valid, server health received
                setIsProcessing(true);
            }
        }
    };

    const renderUploadFile = (): JSX.Element => {
        const fileName = fileToConvert ? fileToConvert.name : "";
        return <span className={styles.renderedFileName}>{fileName}</span>;
    };

    // TODO: use conversion template data to render the form
    console.log("conversion form data", conversionProcessingData);
    const conversionForm = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            {serverDownModalOpen && (
                <ConversionServerErrorModal
                    closeModal={toggleServerCheckModal}
                />
            )}
            {fileTypeErrorModalOpen && (
                <ConversionFileErrorModal
                    closeModal={toggleFileTypeModal}
                    engineType={conversionProcessingData.engineType}
                />
            )}
            {isProcessing && (
                <ConversionProcessingOverlay
                    toggleProcessing={toggleProcessing}
                    fileName={fileToConvert ? fileToConvert?.name : null}
                />
            )}
            <div className={styles.formContent}>
                <h3 className={styles.title}>Import a non-native file type</h3>
                <h3>
                    Convert and import a non-simularium file by providing the
                    following information
                </h3>
                <h3 className={styles.sectionHeader}>
                    Provide file information (required)
                </h3>
                <h3 className={styles.selectTitle}>Simulation engine</h3>
                <div className={styles.uploadContainer}>
                    <Select
                        className={styles.selectorBox}
                        id="select"
                        suffixIcon={DownCaret}
                        bordered={true}
                        defaultValue="Select"
                        options={selectOptions}
                        onChange={(selectedValue) => {
                            handleEngineChange(selectedValue);
                        }}
                    />
                    <Upload
                        className={styles.upload}
                        listType="text"
                        multiple={false}
                        fileList={fileToConvert ? [fileToConvert] : []}
                        itemRender={renderUploadFile}
                        showUploadList={{
                            showPreviewIcon: false,
                            showDownloadIcon: false,
                            showRemoveIcon: false,
                        }}
                        onChange={({ file }) => {
                            handleFileSelection(file);
                        }}
                    >
                        <Button type="default">Select file</Button>
                    </Upload>
                    {fileToConvert && (
                        <button
                            className={styles.removeFileIcon}
                            onClick={handleRemoveFile}
                        >
                            {Cancel}
                        </button>
                    )}
                </div>
                <Divider orientation="right" orientationMargin={400}/>
                <Button ghost>Cancel</Button>
                <Button
                    type="primary"
                    disabled={!fileToConvert || !engineSelected}
                    onClick={advanceIfServerIsHealthy}
                >
                    Next
                </Button>
            </div>
        </div>
    );

    return conversionForm;
};

function mapStateToProps(state: State) {
    return {
        conversionProcessingData:
            trajectoryStateBranch.selectors.getConversionProcessingData(state),
        conversionStatus:
            trajectoryStateBranch.selectors.getConversionStatus(state),
    };
}

const dispatchToPropsMap = {
    receiveFileToConvert: trajectoryStateBranch.actions.receiveFileToConvert,
    setError: viewerStateBranch.actions.setError,
    setConversionEngine: trajectoryStateBranch.actions.setConversionEngine,
    initializeConversion: trajectoryStateBranch.actions.initializeConversion,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
