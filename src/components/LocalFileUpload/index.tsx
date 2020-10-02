import React from "react";
import { useHistory } from "react-router-dom";
import { Upload, message, Button } from "antd";
import { RequestFileAction } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import customRequest from "./custom-request-upload";
import { ActionCreator } from "redux";
interface FileUploadProps {
    loadLocalFile: ActionCreator<RequestFileAction>;
}

const styles = require("./style.css");

const LocalFileUpload = ({ loadLocalFile }: FileUploadProps) => {
    const history = useHistory();
    const onChange = ({ file }: UploadChangeParam) => {
        history.push("/viewer");
        if (file.status === "done") {
            message.success(`${file.name} file uploaded successfully`);
        } else if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
        }
    };
    return (
        <Upload
            onChange={onChange}
            showUploadList={false}
            customRequest={(options) => customRequest(options, loadLocalFile)}
        >
            <Button type="ghost" className={styles.uploadButton}>
                Import Simularium file...
            </Button>
        </Upload>
    );
};

export default LocalFileUpload;
