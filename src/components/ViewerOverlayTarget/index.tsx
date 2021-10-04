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

const ViewerOverlayTarget = ({
    resetDragOverViewer,
    loadLocalFile,
    isLoading,
    fileIsDraggedOver,
}: ViewerOverlayTargetProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const [numCustomRequests, setNumCustomRequests] = useState(0);

    if (fileIsDraggedOver && !showTarget) {
        setVisibility(true);
    } else if (!fileIsDraggedOver && showTarget) {
        setVisibility(false);
    }

    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            resetDragOverViewer();
            setVisibility(false);
            setNumCustomRequests(0);
        } else if (file.status === "error") {
            setVisibility(false);
            message.error(`${file.name} file upload failed.`);
            resetDragOverViewer();
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        setDroppedFiles([...event.dataTransfer.files]);
    };

    const beforeUpload = () => {
        setNumCustomRequests(numCustomRequests + 1);
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
            beforeUpload={beforeUpload}
            showUploadList={false}
            openFileDialogOnClick={false}
            customRequest={(options) =>
                customRequest(
                    options,
                    droppedFiles,
                    numCustomRequests,
                    loadLocalFile
                )
            }
            multiple
            directory
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
