import React from "react";
import { Upload, message, Button } from "antd";
import { ActionCreator } from "redux";
import { MetadataStateBranch } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";
import { ResetDragOverViewerAction } from "../../state/selection/types";

const { Dragger } = Upload;

interface FIleUploadProps {
    loadLocalFile: () => void;
    saveLocalSimulariumFile: ActionCreator<MetadataStateBranch>;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
}
const FileUpload = ({
    simulariumFile,
    loadLocalFile,
    saveLocalSimulariumFile,
    resetDragOverViewer,
}: FIleUploadProps) => {
    const onChange = ({ file, fileList }: UploadChangeParam) => {
        console.log(file.status, simulariumFile);
        if (file.status === "uploading") {
            resetDragOverViewer();
        }
        if (file.status === "done") {
            message.success(`${file.name} file uploaded successfully`);
            resetDragOverViewer();
            loadLocalFile();
        } else if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
        }
    };
    return (
        <Dragger
            onChange={onChange}
            openFileDialogOnClick={false}
            customRequest={({ file, onSuccess, onError }) => {
                file.text()
                    .then((text) => JSON.parse(text))
                    .then((data) => {
                        saveLocalSimulariumFile({ name: file.name, data });
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
            {/* <p className="ant-upload-drag-icon">
            </p>
            <p className="ant-upload-text">
                Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
            </p> */}
        </Dragger>
    );
};

export default FileUpload;
