import React from "react";
import { Upload, message, Button } from "antd";
import { ActionCreator } from "redux";
import { LocalSimFile } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import Icons from "../Icons";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { SetViewerStatusAction } from "../../state/metadata/types";
import { VIEWER_SUCCESS } from "../../state/metadata/constants";

interface FileUploadProps {
    loadLocalFile: (simulariumFile: LocalSimFile) => void;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
}
const FileUpload = ({ loadLocalFile, setViewerStatus }: FileUploadProps) => {
    const onChange = ({ file, fileList }: UploadChangeParam) => {
        if (file.status !== "uploading") {
            console.log(file, fileList);
        }
        if (file.status === "done") {
            message.success(`${file.name} file uploaded successfully`);
            setViewerStatus({ status: VIEWER_SUCCESS });
        } else if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
        }
    };
    return (
        <Upload
            onChange={onChange}
            customRequest={({
                file,
                onSuccess,
                onError,
            }: RcCustomRequestOptions) => {
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
            <Button>{Icons.UploadFile} Upload Simularium File</Button>
        </Upload>
    );
};

export default FileUpload;
