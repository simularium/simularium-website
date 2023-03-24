import React, { useState } from "react";
import { Upload, Select, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { ActionCreator } from "redux";

import {
    ClearSimFileDataAction,
    LocalSimFile,
} from "../../state/trajectory/types";
import {
    ResetDragOverViewerAction,
    SetErrorAction,
} from "../../state/viewer/types";
import { Loading, UploadFile } from "../Icons";
import customRequest from "../LocalFileUpload/custom-request-upload";
import { SetViewerStatusAction } from "../../state/viewer/types";

const { Dragger } = Upload;

import styles from "./style.css";

interface ConversionFormOverlayProps {
    [key: string]: any;
    isLoading: boolean;
}

const ConversionFormOverlay = ({
    isLoading, // why doesnt this work when i try to write isLoading: true
}: ConversionFormOverlayProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(true);

    // taken from ViewerOverlayTarget
    const loadingOverlay = (
        <div className={styles.container}>
            <p className="loading-icon">{Loading}</p>
            <p className="loading-text">Loading Simularium Model</p>
        </div>
    );

    const fileImportingOverlay = (
        <Dragger
            className={styles.container}
            // onChange={onChange}
            // onDrop={handleDrop}
            showUploadList={false}
            openFileDialogOnClick={false}
            // beforeUpload={beforeUpload}
            // customRequest={(options) =>
            //     customRequest(
            //         options,
            //         droppedFiles,
            //         clearSimulariumFile,
            //         loadLocalFile,
            //         setViewerStatus,
            //         setError
            //     )
            // }
            multiple
            // TODO: enable directory upload?
            // directory
        >
            <p> Import a non-native file type</p>
            <p>
                {" "}
                Convert and import a non-simularium file by providing the
                following information
            </p>
            <p> Provide file information (requried) </p>
            <p>Simulation Engine</p>

            <Select
                showArrow={true}
                defaultValue="Smoldyn"
                style={{ width: 200 }}
                options={[
                    { value: "cytosim", label: "cytosim" },
                    { value: "cellPACK", label: "cellPACK" },
                    { value: "Smoldyn", label: "Smoldyn" },
                    { value: "SpringSaLaD", label: "SpringSaLaD" },
                ]}
            />
            <button>Cancel</button>
            <button>Next</button>
            <p className="ant-upload-drag-icon">
                {isLoading ? Loading : UploadFile}
            </p>
            <p className="ant-upload-text">
                {isLoading
                    ? "Loading Simularium file"
                    : "This is the ConversionFormOverLay"}
            </p>
        </Dragger>
    );

    if (showTarget) {
        return fileImportingOverlay; // whatever the component will return
    } else if (isLoading) {
        return loadingOverlay;
    } else {
        return null;
    }
};

export default ConversionFormOverlay;
