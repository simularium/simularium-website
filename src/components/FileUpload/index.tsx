import React from "react";
import { Upload, message, Button } from "antd";
import { ActionCreator } from "redux";
import { LocalSimFile } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import Icons from "../Icons";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { SetViewerStatusAction } from "../../state/metadata/types";

interface FileUploadProps {
    loadLocalFile: (simulariumFile: LocalSimFile) => void;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
}
const FileUpload = ({ loadLocalFile }: FileUploadProps) => {
    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            message.success(`${file.name} file uploaded successfully`);
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
                        console.log(file.lastModified);
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
