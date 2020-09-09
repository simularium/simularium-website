import React, { useState } from "react";
import { Upload, message } from "antd";
import { ActionCreator } from "redux";
import {
    SetViewerStatusAction,
    LocalSimFile,
} from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";
import { ResetDragOverViewerAction } from "../../state/selection/types";
import { VIEWER_SUCCESS } from "../../state/metadata/constants";
import { Loading } from "../Icons";

const { Dragger } = Upload;

interface ViewerOverlayTargetProps {
    loadLocalFile: (localFile: LocalSimFile) => void;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
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
    if (isLoading && !showTarget) {
        setVisibility(true);
    }
    //
    if (!isLoading && !fileIsDraggedOverViewer && showTarget) {
        setVisibility(false);
    }
    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "uploading") {
            setVisibility(true);
        }
        if (file.status === "done") {
            // message.success(`${file.name} file uploaded successfully`);
            resetDragOverViewer();
            // setViewerStatus({ status: VIEWER_SUCCESS });
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
            customRequest={({ file, onSuccess, onError }) => {
                file.text()
                    .then((text) => JSON.parse(text))
                    .then((data) => {
                        loadLocalFile({
                            name: file.name,
                            data,
                        });
                    })
                    .then(() =>
                        onSuccess(
                            {
                                name: file.name,
                                status: "done",
                                url: "",
                            },
                            file
                        )
                    )
                    .catch((error) => {
                        console.log(error);
                        onError(error);
                    });
            }}
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
