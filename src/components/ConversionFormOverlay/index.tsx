import React, { useState } from "react";
import { Upload, Select, Divider, message, Button } from "antd";
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

    const conversionFormOverlay = (
        <div className={styles.container}>
            {/* <p> HELLO</p> */}
            <span className={styles.text}>
                <h3 className={styles.title} style={{ fontSize: 36 }}>
                    {" "}
                    Import a non-native file type
                </h3>
                <h3>
                    Convert and import a non-simularium file by providing the
                    following information
                </h3>
                <h3> Provide file information (requried) </h3>
                <h3>Simulation Engine</h3>
            </span>

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
            <Button
                type="primary"
                // onClick={handleUpload}
                // disabled={fileList.length === 0}
                // loading={uploading}
                style={{ marginTop: 16 }}
            >
                Select file
            </Button>
            {/* <p className="ant-upload-drag-icon">
                {isLoading ? Loading : UploadFile}
            </p> */}
            {/* <p className="ant-upload-text">
                {isLoading
                    ? "Loading Simularium file"
                    : "This is the ConversionFormOverLay"}
            </p> */}
            <Divider orientation="right" orientationMargin={400}>
                {" "}
            </Divider>
            <Button
                type="primary"
                // onClick={handleUpload}
                // disabled={fileList.length === 0}
                // loading={uploading}
                style={{ marginTop: 16 }}
            >
                Cancel
            </Button>
            <Button
                type="primary"
                // onClick={handleUpload}
                // disabled={fileList.length === 0}
                // loading={uploading}
                style={{ marginTop: 16 }}
            >
                Next
            </Button>
            {/* <Dragger
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
           
        </Dragger>
        <p> HELLO</p> */}
        </div>
    );

    if (showTarget) {
        return conversionFormOverlay; // whatever the component will return
    } else if (isLoading) {
        // return loadingOverlay;
        return null;
    } else {
        return null;
    }
};

export default ConversionFormOverlay;
