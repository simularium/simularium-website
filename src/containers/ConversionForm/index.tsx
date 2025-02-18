import React, { useEffect, useState } from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Upload, Select, Divider, Input } from "antd";
import { UploadFile } from "antd/lib/upload";
import { v4 as uuidv4 } from "uuid";
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
    CancelConversionAction,
    SetConversionTitleAction,
} from "../../state/trajectory/types";
import { SetErrorAction } from "../../state/viewer/types";
import {
    AvailableEngines,
    ConversionProcessingData,
    ExtensionMap,
} from "../../state/trajectory/conversion-data-types";
import { MAX_CONVERSION_FILE_SIZE } from "../../constants";
import { ButtonClass, ConversionError } from "../../constants/interfaces";
import ConversionProcessingOverlay from "../../components/ConversionProcessingOverlay";
import { Cancel, DownCaret } from "../../components/Icons";
import { CustomButton } from "../../components/CustomButton";
import ConversionErrorModal from "../../components/ConversionErrorModal";
import customRequest from "./custom-request";

import styles from "./style.css";

interface ConversionProps {
    setConversionEngine: ActionCreator<SetConversionEngineAction>;
    setConversionTitle: ActionCreator<SetConversionTitleAction>;
    conversionProcessingData: ConversionProcessingData;
    receiveFileToConvert: ActionCreator<ReceiveFileToConvertAction>;
    setError: ActionCreator<SetErrorAction>;
    initializeConversion: ActionCreator<InitializeConversionAction>;
    convertFile: ActionCreator<ConvertFileAction>;
    conversionStatus: ConversionStatus;
    setConversionStatus: ActionCreator<SetConversionStatusAction>;
    cancelAutoconversion: ActionCreator<CancelConversionAction>;
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
    setConversionTitle,
    conversionProcessingData,
    setError,
    receiveFileToConvert,
    initializeConversion,
    conversionStatus,
    convertFile,
    setConversionStatus,
    cancelAutoconversion,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile | null>();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [conversionError, setConversionError] = useState<ConversionError>(
        ConversionError.NO_ERROR
    );

    const engineSelected = !!conversionProcessingData.engineType;
    const errorModalOpen = conversionError !== ConversionError.NO_ERROR;

    const errorMessage = {
        [ConversionError.SERVER_ERROR]:
            "We're sorry, the server is currently experiencing an issue. Please try again at a later time. ",
        [ConversionError.FILE_TYPE_ERROR]: `You may want to double check that the file you selected is a valid ${conversionProcessingData.engineType}
                        file and try again. `,
        [ConversionError.FILE_SIZE_ERROR]:
            "Your file exceeds the maximum allowed size of 200 MB, please try uploading a smaller file.",
    };

    useEffect(() => {
        // on page load assume server is down until we hear back from it
        setConversionStatus({ status: ConversionStatus.NoServer });
        initializeConversion();
    }, []);

    useEffect(() => {
        // this is to account for the server going down while a conversion is in process
        if (isProcessing && conversionStatus === ConversionStatus.NoServer) {
            setIsProcessing(false);
            setConversionError(ConversionError.SERVER_ERROR);
        }
    }, [conversionStatus]);

    const closeErrorModal = () => {
        setConversionError(ConversionError.NO_ERROR);
    };

    const cancelProcessing = () => {
        setIsProcessing(false);
        cancelAutoconversion();
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
        // 200 MB limit
        if (file.size !== undefined && file.size > MAX_CONVERSION_FILE_SIZE) {
            setConversionError(ConversionError.FILE_SIZE_ERROR);
            return;
        }
        setFileToConvert(file);
        customRequest(file, receiveFileToConvert, setError);
    };

    const validateFileType = () => {
        const fileExtension = fileToConvert?.name.split(".").pop();
        if (
            fileExtension &&
            validFileExtensions[conversionProcessingData.engineType] ===
                fileExtension.toLowerCase()
        ) {
            return true;
        } else {
            setConversionError(ConversionError.FILE_TYPE_ERROR);
            return false;
        }
    };

    const sendFileToConvert = () => {
        if (conversionStatus === ConversionStatus.NoServer) {
            setConversionError(ConversionError.SERVER_ERROR);
            return;
        }
        if (!validateFileType()) {
            return;
        }
        // we now use this local state lets us distinguish between arriving on this page normally
        // and arriving here because the server went down while a conversion was in process
        setIsProcessing(true);
        setConversionStatus({ status: ConversionStatus.Active });
        const fileId = `${uuidv4()}.simularium`;
        convertFile(fileId);
    };

    const renderUploadFile = (): JSX.Element => {
        const fileName = fileToConvert ? fileToConvert.name : "";
        return <span className={styles.renderedFileName}>{fileName}</span>;
    };

    // TODO: use conversion template data to render the form
    const conversionForm = (
        <div className={classNames(styles.container)}>
            {conversionStatus === ConversionStatus.Active && (
                <ConversionProcessingOverlay
                    fileName={conversionProcessingData.fileName}
                    cancelProcessing={cancelProcessing}
                />
            )}
            {errorModalOpen && (
                <ConversionErrorModal
                    closeModal={closeErrorModal}
                    showForumMessage={
                        conversionError !== ConversionError.FILE_SIZE_ERROR
                    }
                    errorMessage={errorMessage[conversionError] || ""}
                />
            )}
            <div className={styles.formContent}>
                <h3 className={styles.title}>Import a non-native file type</h3>
                <p>
                    Convert and import a non-simularium file by providing the
                    following information
                </p>
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
                        <CustomButton variant={ButtonClass.LightPrimary}>
                            Select file
                        </CustomButton>
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
                {fileToConvert && (
                    <>
                        <h3 className={styles.optionalTitle}>
                            Trajectory title (optional)
                        </h3>
                        <Input
                            className={styles.titleInput}
                            placeholder="Start typing..."
                            onChange={(e) => {
                                setConversionTitle(e.target.value);
                            }}
                        ></Input>
                    </>
                )}
                <Divider className={styles.divider} orientation="right" />
                <CustomButton
                    variant={ButtonClass.LightSecondary}
                    onClick={cancelConversion}
                >
                    Cancel
                </CustomButton>
                <CustomButton
                    variant={ButtonClass.LightPrimary}
                    disabled={!fileToConvert || !engineSelected}
                    onClick={sendFileToConvert}
                >
                    Next
                </CustomButton>
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
    setConversionTitle: trajectoryStateBranch.actions.setConversionTitle,
    initializeConversion: trajectoryStateBranch.actions.initializeConversion,
    convertFile: trajectoryStateBranch.actions.convertFile,
    setConversionStatus: trajectoryStateBranch.actions.setConversionStatus,
    cancelAutoconversion: trajectoryStateBranch.actions.cancelAutoconversion,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
