import React, { useState } from "react";
import { Upload, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { ActionCreator } from "redux";

import { LocalSimFile } from "../../state/trajectory/types";
import { ResetDragOverViewerAction } from "../../state/viewer/types";
import { Loading, UploadFile } from "../Icons";
import customRequest from "../LocalFileUpload/custom-request-upload";

const { Dragger } = Upload;

const styles = require("./style.css");

interface ViewerOverlayTargetProps {
    loadLocalFile: (localFile: LocalSimFile) => void;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    isLoading: boolean;
    fileIsDraggedOver: boolean;
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

const ViewerOverlayTarget = ({
    resetDragOverViewer,
    loadLocalFile,
    isLoading,
    fileIsDraggedOver,
}: ViewerOverlayTargetProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    // const [isDirectory, setIsDirectory] = useState(false);

    if (fileIsDraggedOver && !showTarget) {
        setVisibility(true);
    } else if (!fileIsDraggedOver && showTarget) {
        setVisibility(false);
    }

    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            resetDragOverViewer();
            setVisibility(false);
        } else if (file.status === "error") {
            setVisibility(false);
            message.error(`${file.name} failed to load.`);
            resetDragOverViewer();
        }
    };

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

    const loadingOverlay = (
        <div className={styles.container}>
            <p className="loading-icon">{Loading}</p>
            <p className="loading-text">Loading Simularium Model</p>
        </div>
    );
    const dragAndDropOverlay = (
        <Dragger
            className={styles.container}
            onChange={onChange}
            onDrop={handleDrop}
            showUploadList={false}
            openFileDialogOnClick={false}
            // beforeUpload={beforeUpload}
            customRequest={(options) =>
                customRequest(options, droppedFiles, loadLocalFile)
            }
            multiple
            // TODO: enable directory upload?
            // directory
        >
            <p className="ant-upload-drag-icon">
                {isLoading ? Loading : UploadFile}
            </p>
            <p className="ant-upload-text">
                {isLoading
                    ? "Loading Simularium file"
                    : "Drag a Simularium file here"}
            </p>
        </Dragger>
    );
    if (showTarget) {
        return dragAndDropOverlay;
    } else if (isLoading) {
        return loadingOverlay;
    } else {
        return null;
    }
};

export default ViewerOverlayTarget;
