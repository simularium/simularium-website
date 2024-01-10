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
} from "../../state/trajectory/types";
import { setConversionStatus } from "../../state/trajectory/actions";
import { SetErrorAction } from "../../state/viewer/types";
import {
    AvailableEngines,
    ConversionProcessingData,
    ExtensionMap,
} from "../../state/trajectory/conversion-data-types";
import ConversionProcessingOverlay from "../../components/ConversionProcessingOverlay";
import ConversionServerErrorModal from "../../components/ConversionServerErrorModal";
import ConversionFileErrorModal from "../../components/ConversionFileErrorModal";
import {
    CONVERSION_ACTIVE,
    CONVERSION_NO_SERVER,
} from "../../state/trajectory/constants";
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
    convertFile,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile>();
    const [engineSelected, setEngineSelected] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [serverDownModalOpen, setServerIsDownModalOpen] =
        useState<boolean>(false);
    const [fileTypeErrorModalOpen, setFileTypeErrorModalOpen] = useState(false);

    useEffect(() => {
        // on page load assume server is down until we hear back from it
        setConversionStatus({ status: CONVERSION_NO_SERVER });
        initializeConversion();
    }, []);

    useEffect(() => {
        // this it to account for the server going down while a conversion is in process
        if (isProcessing && conversionStatus === CONVERSION_NO_SERVER) {
            setIsProcessing(false);
            setServerIsDownModalOpen(true);
        }
    }, [conversionStatus]);

    // callbacks for state variables
    const toggleServerCheckModal = () => {
        setServerIsDownModalOpen(!serverDownModalOpen);
    };

    const toggleFileTypeModal = () => {
        setFileTypeErrorModalOpen(!fileTypeErrorModalOpen);
    };

    const cancelProcessing = () => {
        setIsProcessing(false);
    };

    const handleEngineChange = (selectedValue: string) => {
        const selectedEngine = selectedValue as AvailableEngines;
        setConversionEngine(selectedEngine);
        setEngineSelected(true);
    };

    const handleFileSelection = async (file: UploadFile) => {
        setFileToConvert(file);
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
            if (conversionStatus === CONVERSION_NO_SERVER) {
                setServerIsDownModalOpen(true);
            } else {
                // we now use this local state lets us distinguish between arriving on this page normally
                // and arriving here because the server went down while a conversion was in process
                setIsProcessing(true);
                setConversionStatus({ status: CONVERSION_ACTIVE });
                convertFile();
            }
        }
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
            {conversionStatus === CONVERSION_ACTIVE && (
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
                        onChange={(selectedValue) => {
                            handleEngineChange(selectedValue);
                        }}
                    />
                    <Upload
                        className={styles.upload}
                        listType="text"
                        multiple={false}
                        fileList={fileToConvert ? [fileToConvert] : []}
                        showUploadList={{
                            showPreviewIcon: false,
                            showDownloadIcon: false,
                            showRemoveIcon: true,
                        }}
                        onChange={({ file }) => {
                            handleFileSelection(file);
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
                <Divider orientation="right" orientationMargin={400}>
                    {" "}
                </Divider>
                <Button ghost>Cancel</Button>
                <Button
                    type="primary"
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
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
