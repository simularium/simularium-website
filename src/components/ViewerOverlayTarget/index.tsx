import React, { useState } from "react";
import { Upload, message } from "antd";
import { ActionCreator } from "redux";
import { LocalSimFile } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import { ResetDragOverViewerAction } from "../../state/selection/types";
import { Loading } from "../Icons";
import customRequest from "../FileUpload/custom-request-upload";

const { Dragger } = Upload;

interface ViewerOverlayTargetProps {
    loadLocalFile: (localFile: LocalSimFile) => void;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    isLoading: boolean;
    fileIsDraggedOverViewer: boolean;
}
const ViewerOverlayTarget = ({
    resetDragOverViewer,
    loadLocalFile,
    isLoading,
    fileIsDraggedOverViewer,
}: ViewerOverlayTargetProps) => {
    const [showTarget, setVisibility] = useState(false);
    if (fileIsDraggedOverViewer && !showTarget) {
        setVisibility(true);
    }
    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            message.success(`${file.name} file uploaded successfully`);
            resetDragOverViewer();
            setVisibility(false);
        } else if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
            setVisibility(false);
        }
    };
    return showTarget ? (
        <Dragger
            onChange={onChange}
            openFileDialogOnClick={false}
            customRequest={(options) => customRequest(options, loadLocalFile)}
        >
            <p className="ant-upload-drag-icon">{isLoading ? Loading : null}</p>
            <p className="ant-upload-text">
                {isLoading
                    ? "Loading Simularium File"
                    : "Drag file to this area to upload"}
            </p>
            <p className="ant-upload-hint">
                Support for a single Simularium File.
            </p>
        </Dragger>
    ) : null;
};

export default ViewerOverlayTarget;
