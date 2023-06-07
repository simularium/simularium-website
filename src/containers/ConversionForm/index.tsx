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
    serverHealthy: boolean;
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
    serverHealthy,
    simulariumController,
}: ConversionProps): JSX.Element => {
    const [fileToConvert, setFileToConvert] = useState<UploadFile>();
    const [engineSelected, setEngineSelected] = useState<boolean>(false);
    const [serverDown, setServerIsDown] = useState<boolean>(false);

    const handleFileSelection = async (file: UploadFile) => {
        setFileToConvert(file);
        // necessarry to check if simController exists?
        // if server is unhealthy, viewer state will update and throw modal
        // below method doesn't exist yet:
        // simulariumController.sendServerCheck();

        //to simulate server being down when we upload:
        setServerIsDown(true);

        //TODO: once modal is dismissed it wont arise again
        //unless "serverHealthy" changes in state
        // should we refire the modal if a user ignores server check
        // and tried to continue with next button?
        //
    };

    useEffect(() => {
        // the ping from handleFileSelection should set this off
        if (!serverHealthy) {
            setServerIsDown(true);
        }
    }, [serverHealthy]);

    const closeServerCheckModal = () => {
        setServerIsDown(false);
    };

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const toggleProcessing = () => {
        setIsProcessing(!isProcessing);
    };

    // TODO: use conversion template data to render the form
    console.log("conversion form data", conversionProcessingData);
    const conversionForm = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            {serverDown ? (
                <ConversionServerCheckModal
                    closeModal={closeServerCheckModal}
                />
            ) : null}
            {isProcessing ? (
                <ConversionProcessingOverlay
                    toggleProcessing={toggleProcessing}
                    fileName={fileToConvert ? fileToConvert?.name : null}
                />
            ) : null}
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
                        onChange={() => {
                            setConversionEngine();
                            setEngineSelected(true);
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
                    onClick={() => setIsProcessing(!isProcessing)}
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
        serverHealth: viewerStateBranch.selectors.getServerHealth(state),
    };
}

const dispatchToPropsMap = {
    receiveFileToConvert: trajectoryStateBranch.actions.receiveFileToConvert,
    setError: viewerStateBranch.actions.setError,
    setConversionEngine: trajectoryStateBranch.actions.setConversionEngine,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ConversionForm);