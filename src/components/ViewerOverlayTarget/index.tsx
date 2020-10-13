import React, { useState } from "react";
import { Upload, message } from "antd";
import { ActionCreator } from "redux";
import { LocalSimFile } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import { ResetDragOverViewerAction } from "../../state/selection/types";
import { Loading, UploadFile } from "../Icons";
import customRequest from "../LocalFileUpload/custom-request-upload";

const { Dragger } = Upload;

const styles = require("./style.css");

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
    } else if (!fileIsDraggedOverViewer && showTarget) {
        setVisibility(false);
    }

    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            resetDragOverViewer();
            setVisibility(false);
        } else if (file.status === "error") {
            setVisibility(false);
        }
    };
    const loadingOverlay = (
        <div className={styles.container}>
            <p className="ant-upload-drag-icon">{Loading}</p>
            <p className="ant-upload-text">Loading Simularium file</p>
        </div>
    );
    console.log(isLoading);
    return isLoading
        ? loadingOverlay
        : showTarget && (
              <Dragger
                  className={styles.container}
                  onChange={onChange}
                  showUploadList={false}
                  openFileDialogOnClick={false}
                  customRequest={(options) =>
                      customRequest(options, loadLocalFile)
                  }
              >
                  <p className="ant-upload-drag-icon">
                      {isLoading ? Loading : UploadFile}
                  </p>
                  <p className="ant-upload-text">
                      {isLoading
                          ? "Loading Simularium file"
                          : "Drag your trajectory here"}
                  </p>
                  {isLoading && (
                      <p className="ant-upload-hint">
                          Support for a single Simularium file
                      </p>
                  )}
              </Dragger>
          );
};

export default ViewerOverlayTarget;
