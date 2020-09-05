import React from "react";
import { Upload, message } from "antd";
import { ActionCreator } from "redux";
import { ReceiveAction } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";
import { ResetDragOverViewerAction } from "../../state/selection/types";

const { Dragger } = Upload;

interface FIleUploadProps {
    loadLocalFile: () => void;
    changeLocalSimulariumFile: ActionCreator<ReceiveAction>;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
}
const FileUpload = ({
    loadLocalFile,
    changeLocalSimulariumFile,
    resetDragOverViewer,
}: FIleUploadProps) => {
    const onChange = ({ file }: UploadChangeParam) => {
        console.log(file.status);
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
                        changeLocalSimulariumFile({
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
