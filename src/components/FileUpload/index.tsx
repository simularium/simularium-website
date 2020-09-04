import React, { useState } from "react";
import { Upload, message, Button, Icon } from "antd";
import { ActionCreator } from "redux";
import { MetadataStateBranch } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

interface FIleUploadProps {
    loadLocalFile: () => void;
    saveLocalSimulariumFile: ActionCreator<MetadataStateBranch>;
}
const FileUpload = ({
    loadLocalFile,
    saveLocalSimulariumFile,
}: FIleUploadProps) => {
    const onChange = ({ file, fileList }: UploadChangeParam) => {
        if (file.status !== "uploading") {
            console.log(file, fileList);
        }
        if (file.status === "done") {
            message.success(`${file.name} file uploaded successfully`);
            loadLocalFile();
        } else if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
        }
    };
    return (
        <Upload
            onChange={onChange}
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
            <Button>
                <Icon type="upload" /> Upload Simularium File
            </Button>
        </Upload>
    );
};

export default FileUpload;
