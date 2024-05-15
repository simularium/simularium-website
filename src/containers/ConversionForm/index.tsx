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
    ConvertFileAction,
    InitializeConversionAction,
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
    SetConversionStatusAction,
} from "../../state/trajectory/types";
import { SetErrorAction } from "../../state/viewer/types";
import {
    AvailableEngines,
    ConversionProcessingData,
    ExtensionMap,
} from "../../state/trajectory/conversion-data-types";
import ConversionProcessingOverlay from "../../components/ConversionProcessingOverlay";
import ConversionServerErrorModal from "../../components/ConversionServerErrorModal";
import ConversionFileErrorModal from "../../components/ConversionFileErrorModal";
import { Cancel, DownCaret } from "../../components/Icons";
import customRequest from "./custom-request";

import theme from "../../components/theme/light-theme.css";
import styles from "./style.css";

interface ConversionProps {
    setConversionEngine: ActionCreator<SetConversionEngineAction>;
    conversionProcessingData: ConversionProcessingData;
    receiveFileToConvert: ActionCreator<ReceiveFileToConvertAction>;
    setError: ActionCreator<SetErrorAction>;
    initializeConversion: ActionCreator<InitializeConversionAction>;
    convertFile: ActionCreator<ConvertFileAction>;
    conversionStatus: ConversionStatus;
    setConversionStatus: ActionCreator<SetConversionStatusAction>;
}

const validFileExtensions: ExtensionMap = {
    // TODO: update this with correct extensions when conversion is ready
    Smoldyn: "txt",
    // cytosim: "txt",
    // cellPACK: "txt",
    // SpringSaLaD: "txt",
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
    convertFile,
    setConversionStatus,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile | null>();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [serverErrorModalOpen, setServerErrorModalOpen] =
        useState<boolean>(false);
    const [fileTypeErrorModalOpen, setFileTypeErrorModalOpen] = useState(false);

    const engineSelected = !!conversionProcessingData.engineType;

    useEffect(() => {
        // on page load assume server is down until we hear back from it
        setConversionStatus({ status: ConversionStatus.NoServer });
        initializeConversion();
    }, []);

    useEffect(() => {
        // this is to account for the server going down while a conversion is in process
        if (isProcessing && conversionStatus === ConversionStatus.NoServer) {
            setIsProcessing(false);
            setServerErrorModalOpen(true);
        }
    }, [conversionStatus]);

    // callbacks for state variables
    const toggleServerCheckModal = () => {
        setServerErrorModalOpen(!serverErrorModalOpen);
    };

    const toggleFileTypeModal = () => {
        setFileTypeErrorModalOpen(!fileTypeErrorModalOpen);
    };

    const cancelProcessing = () => {
        setIsProcessing(false);
        setConversionStatus({ status: ConversionStatus.Inactive });
    };

    const cancelConversion = () => {
        setConversionStatus({ status: ConversionStatus.Inactive });
    };

    const handleEngineChange = (selectedValue: string) => {
        const selectedEngine = selectedValue as AvailableEngines;
        setConversionEngine(selectedEngine);
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

    const sendFileToConvert = () => {
        if (
            engineSelected &&
            fileToConvert &&
            validateFileType(fileToConvert.name)
        ) {
            if (conversionStatus === ConversionStatus.NoServer) {
                setServerErrorModalOpen(true);
            } else {
                // we now use this local state lets us distinguish between arriving on this page normally
                // and arriving here because the server went down while a conversion was in process
                setIsProcessing(true);
                setConversionStatus({ status: ConversionStatus.Active });
                convertFile();
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
            {serverErrorModalOpen && (
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
            {conversionStatus === ConversionStatus.Active && (
                <ConversionProcessingOverlay
                    fileName={conversionProcessingData.fileName}
                    cancelProcessing={cancelProcessing}
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
                        <Button className="primary-button">Select file</Button>
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
                <Divider className={styles.divider} orientation="right" />
                <Button className="secondary-button" onClick={cancelConversion}>
                    Cancel
                </Button>
                <Button
                    className="primary-button"
                    disabled={!fileToConvert || !engineSelected}
                    onClick={sendFileToConvert}
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
    convertFile: trajectoryStateBranch.actions.convertFile,
    setConversionStatus: trajectoryStateBranch.actions.setConversionStatus,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
