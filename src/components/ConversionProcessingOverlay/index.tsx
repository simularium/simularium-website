import React, { useState } from "react";
import { Button, Divider, Spin, Upload, message } from "antd";
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
import customRequest from "../FileUploadModal/upload-local-files";
import { SetViewerStatusAction } from "../../state/viewer/types";

const { Dragger } = Upload;

import styles from "./style.css";

interface ConversionProcessingOverlayProps {
    // clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    // loadLocalFile: (localFile: LocalSimFile) => void;
    // setViewerStatus: ActionCreator<SetViewerStatusAction>;
    // resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    // setError: ActionCreator<SetErrorAction>;
    isProcessing: boolean;
    fileName: string | null;
}

/*
Order of operations for this Antd Upload (Dragger) component:

1. User drag and drops file(s) into the viewer dragAndDropOverlay
2. handleDrop is called once
3. beforeUpload (if it's defined) is called once
4. customRequest is is called once
5. Steps 3-4 repeat for a total of n times (n = number of files)
6. If customRequest results in success (onSuccess), file.status changes to "done".
   If customRequest results in error, file.status changes to "error".
   These two changes trigger onChange.
*/

const ConversionProcessingOverlay = ({
    // resetDragOverViewer,
    // loadLocalFile,
    // clearSimulariumFile,
    isProcessing,
    fileName,
}: // fileIsDraggedOver,
// setViewerStatus,
// setError,
ConversionProcessingOverlayProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    // const [isDirectory, setIsDirectory] = useState(false);

    // Only idea I've come up with for directory upload, but problem:
    // don't know how many files to expect from inside directory! Why does
    // fileList only contain one file at a time unlike in LocalFileUpload component??
    // const beforeUpload = (file, fileList) => {
    //     console.log("beforeUpload")
    //     console.log(fileList)
    //     const isFileFromDirectory = file.webkitRelativePath.includes("/");
    //     if (isFileFromDirectory && !droppedFiles[0].webkitRelativePath.includes("/")) {
    //         setIsDirectory(true);
    //         setDroppedFiles([...file]);
    //     } else if (isFileFromDirectory) {
    //         droppedFiles.push(file);
    //     }
    // }

    const handleDrop = (event: React.DragEvent) => {
        setDroppedFiles([...event.dataTransfer.files]);
    };

    const processingOverlay = (
        <div className={styles.container}>
            <h1> File conversion in progress </h1>
            <p> {fileName} is being converted and will load when complete.</p>
            <p> Processing time will vary depending on file size. </p>
            <p> SMALL BLUE TEXT WITH ARROW Stop and go back to form </p>
            <div className={styles.spin}>
                <Spin size={"large"}> </Spin>
            </div>
            <p className="loading-text"> Processing... </p>
            <p> BREAK </p>
            <h2> Open another instance of Simularium </h2>
            <Button> Open in new tab ARROW </Button>
            <Divider />
            <Button>Cancel file import</Button>
        </div>
    );
    // const dragAndDropOverlay = (
    //     <Dragger
    //         className={styles.container}
    //         onChange={onChange}
    //         onDrop={handleDrop}
    //         showUploadList={false}
    //         openFileDialogOnClick={false}
    //         // beforeUpload={beforeUpload}
    //         customRequest={(options) =>
    //             customRequest(
    //                 droppedFiles,
    //                 clearSimulariumFile,
    //                 loadLocalFile,
    //                 setViewerStatus,
    //                 setError,
    //                 options
    //             )
    //         }
    //         multiple
    //         // TODO: enable directory upload?
    //         // directory
    //     >
    //         <p className="ant-upload-drag-icon">
    //             {isLoading ? Loading : UploadFile}
    //         </p>
    //         <p className="ant-upload-text">
    //             {isLoading
    //                 ? "Loading Simularium file"
    //                 : "Drag a Simularium file here"}
    //         </p>
    //     </Dragger>
    // );

    return processingOverlay;
};

export default ConversionProcessingOverlay;
