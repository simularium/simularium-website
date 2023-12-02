import React, { useEffect, useState } from "react";
import { Upload, Select, Divider, Button } from "antd";
import classNames from "classnames";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import theme from "../../components/theme/light-theme.css";
import { State } from "../../state";
import trajectoryStateBranch from "../../state/trajectory";
import simulariumStateBranch from "../../state/simularium";
import viewerStateBranch from "../../state/viewer";
import {
    ReceiveFileToConvertAction,
    SetConversionEngineAction,
} from "../../state/trajectory/types";
import {
    AvailableEngines,
    ExtensionMap,
    Template,
    TemplateMap,
} from "../../state/trajectory/conversion-data-types";

import styles from "./style.css";
import customRequest from "./custom-request";
import { SetErrorAction } from "../../state/viewer/types";
import { UploadFile } from "antd/lib/upload";
import ConversionServerCheckModal from "../../components/ConversionServerCheckModal";
import { SimulariumController } from "@aics/simularium-viewer";
import ConversionProcessingOverlay from "../../components/ConversionProcessingOverlay";
import ConversionFileErrorModal from "../../components/ConversionFileErrorModal";
import { NetConnectionParams } from "@aics/simularium-viewer/type-declarations/simularium";

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
    simulariumController: SimulariumController;
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
    simulariumController,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile>();
    const [engineSelected, setEngineSelected] = useState<boolean>(false);
    const [serverDownModalOpen, setServerIsDownModalOpen] =
        useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [fileTypeErrorModalOpen, setFileTypeErrorModalOpen] = useState(false);
    const [serverHealth, setServerHealth] = useState<boolean>(false);

    // possible to arrive here without configuring a controller
    // so we need this config to send a health check
    const netConnectionConfig: NetConnectionParams = {
        serverIp: "0.0.0.0",
        serverPort: 8765,
        useOctopus: true,
        secureConnection: false,
    };
    const controller =
        simulariumController ||
        new SimulariumController({
            netConnectionSettings: netConnectionConfig,
        });

    const generateRequestId = () => {
        return Date.now(); // simple example, you might want something more sophisticated
    };

    const healthCheckTimeouts: any = {};

    const onHealthCheckResponse = (requestId: any): void => {
        setServerHealth(true);

        // Clear the timeout if a response is received
        if (healthCheckTimeouts[requestId]) {
            clearTimeout(healthCheckTimeouts[requestId]);
            delete healthCheckTimeouts[requestId]; // Clean up the timeout reference
        }
    };

    const checkServerHealthWithTimeout = (
        netConnectionConfig: NetConnectionParams
    ) => {
        const requestId = generateRequestId();
        controller.checkServerHealth(
            () => onHealthCheckResponse(requestId),
            netConnectionConfig
        );

        // Set a 15-second timeout for this health check request
        healthCheckTimeouts[requestId] = setTimeout(() => {
            if (healthCheckTimeouts[requestId]) {
                setServerHealth(false);
                delete healthCheckTimeouts[requestId]; // Clean up the timeout reference
            }
        }, 15000);
    };

    // configure controller and send health check
    useEffect(() => {
        checkServerHealthWithTimeout(netConnectionConfig);
    }, []);

    // useEffect to log a change in server health
    useEffect(() => {
        console.log("we received a server health response! :)");
        console.log(
            "localServerHealth",
            serverHealth,
            "netConnectionConfig",
            netConnectionConfig
        );
    }, [serverHealth]);

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

    const handleFileSelection = async (file: UploadFile) => {
        setFileToConvert(file);
        if (!serverHealth) {
            setServerIsDownModalOpen(true);
        }
    };

    const validateFileType = (fileName: string) => {
        const fileExtension = fileName.split(".").pop();
        if (fileExtension) {
            if (
                validFileExtensions[conversionProcessingData.engineType] ===
                fileExtension.toLowerCase()
            ) {
                setIsProcessing(!isProcessing);
                return true;
            }
        }
        setFileTypeErrorModalOpen(true);
        return false;
    };

    const doTheNextThing = () => {
        console.log();
        // this should ping server
        checkServerHealthWithTimeout(netConnectionConfig);
    };

    // TODO: use conversion template data to render the form
    console.log("conversion form data", conversionProcessingData);
    const readyToConvert = fileToConvert && engineSelected && serverHealth;
    const conversionForm = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            {serverDownModalOpen && (
                <ConversionServerCheckModal
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
                    disabled={!readyToConvert}
                    onClick={() => {
                        if (
                            readyToConvert &&
                            validateFileType(fileToConvert.name)
                        ) {
                            doTheNextThing();
                        }
                    }} // this will be unclickable anyway, but typescript doesn't know that
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
        simulariumController:
            simulariumStateBranch.selectors.getSimulariumController(state),
    };
}

const dispatchToPropsMap = {
    receiveFileToConvert: trajectoryStateBranch.actions.receiveFileToConvert,
    setError: viewerStateBranch.actions.setError,
    setConversionEngine: trajectoryStateBranch.actions.setConversionEngine,
    setSimulariumController:
        simulariumStateBranch.actions.setSimulariumController,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);
