import React from "react";
import { Upload, message, Button } from "antd";
import { LocalSimFile } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import Icons from "../Icons";

import customRequest from "./custom-request-upload";
interface FileUploadProps {
    loadLocalFile: (simulariumFile: LocalSimFile) => void;
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
            customRequest={(options) => customRequest(options, loadLocalFile)}
        >
            <Button type="ghost">
                {Icons.UploadFile} Upload Simularium File
            </Button>
        </Upload>
    );
};

export default FileUpload;
