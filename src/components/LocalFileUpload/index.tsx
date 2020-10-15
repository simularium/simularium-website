import React from "react";
import { useHistory } from "react-router-dom";
import { Upload, message, Button } from "antd";
import { RequestLocalFileAction } from "../../state/metadata/types";
import { UploadChangeParam } from "antd/lib/upload";

import customRequest from "./custom-request-upload";
import { ActionCreator } from "redux";
import { VIEWER_PATHNAME } from "../../routes";
interface FileUploadProps {
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
}

const styles = require("./style.css");

const LocalFileUpload = ({ loadLocalFile }: FileUploadProps) => {
    const history = useHistory();
    const onChange = ({ file }: UploadChangeParam) => {
        if (!history.location.pathname.startsWith(VIEWER_PATHNAME)) {
            history.push(VIEWER_PATHNAME);
        }
        if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
        }
    };
    return (
        <Upload
            onChange={onChange}
            showUploadList={false}
            customRequest={(options) => customRequest(options, loadLocalFile)}
            className={styles.container}
        >
            <Button type="ghost">Import Simularium file...</Button>
        </Upload>
    );
};

export default LocalFileUpload;
