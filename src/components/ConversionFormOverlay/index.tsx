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
import { Loading } from "../Icons"; // removed UploadFile icon
import customRequest from "../LocalFileUpload/custom-request-upload";
import { SetViewerStatusAction } from "../../state/viewer/types";
import { DownArrow } from "../Icons";
import type { UploadFile } from "antd/es/upload/interface";

const { Dragger } = Upload;

import styles from "./style.css";

interface ConversionFormOverlayProps {
    [key: string]: any;
    isLoading: boolean;
}

const fileList: UploadFile[] = [
    {
        uid: "0",
        name: "xxx.png",
    },
];

const ConversionFormOverlay = ({
    isLoading, // why doesnt this work when i try to write isLoading: true
}: ConversionFormOverlayProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(true);
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: "-1",
            name: "default.format",
            status: "done",
            url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
    ]);

    // taken from ViewerOverlayTarget
    const loadingOverlay = (
        <div className={styles.container}>
            <p className="loading-icon">{Loading}</p>
            <p className="loading-text">Loading Simularium Model</p>
        </div>
    );

    const conversionFormOverlay = (
        <div className={styles.container}>
            <h3 className={styles.title} style={{ fontSize: 30 }}>
                Import a non-native file type
            </h3>
            <h3>
                Convert and import a non-simularium file by providing the
                following information
            </h3>
            <h3> Provide file information (required) </h3>
            <h3 style={{ paddingBottom: 0 }}>Simulation Engine</h3>
            <div className={styles.uploadcontainer}>
                <Select
                    showArrow={true} // this isn't working
                    defaultValue="Smoldyn" // trying to add {DownArrow} isn't working, it works inside a Button
                    style={{ width: 200 }}
                    options={[
                        { value: "cytosim", label: "cytosim" },
                        { value: "cellPACK", label: "cellPACK" },
                        { value: "Smoldyn", label: "Smoldyn" },
                        { value: "SpringSaLaD", label: "SpringSaLaD" },
                    ]}
                />
                <Upload
                    className={styles.upload}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    // listType="picture"
                    // style={{width: 40}}
                    defaultFileList={[...fileList]}
                >
                    <Button
                        type="primary"
                        className={styles.clearbutton}
                        // onClick={handleUpload}
                        // disabled={fileList.length === 0}
                        // loading={uploading}
                        style={{ marginTop: 16 }}
                    >
                        Select file
                    </Button>
                </Upload>
            </div>
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
                className={styles.clearbutton}
                // onClick={handleUpload}
                // disabled={fileList.length === 0}
                // loading={uploading}
                style={{ marginTop: 16 }}
            >
                Cancel
            </Button>
            <Button
                type="primary"
                className={styles.clearbutton}
                // onClick={handleUpload}
                // disabled={fileList.length === 0}
                // loading={uploading}
                style={{ marginTop: 16 }}
            >
                Next
            </Button>
        </div>
    );

    if (showTarget) {
        return conversionFormOverlay;
    } else if (isLoading) {
        // return loadingOverlay;
        return null;
    } else {
        return null;
    }
};

export default ConversionFormOverlay;
