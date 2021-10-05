import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, message, Button } from "antd";
import { RequestLocalFileAction } from "../../state/trajectory/types";
import { UploadChangeParam } from "antd/lib/upload";

import customRequest from "./custom-request-upload";
import { ActionCreator } from "redux";
import { VIEWER_PATHNAME } from "../../routes";
interface FileUploadProps {
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
}

const LocalFileUpload = ({ loadLocalFile }: FileUploadProps) => {
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            setDroppedFiles([]);
        } else if (file.status === "error") {
            message.error(`${file.name} file upload failed.`);
            setDroppedFiles([]);
        }
    };

    const beforeUpload = (file: File, fileList: File[]) => {
        if (droppedFiles.length === 0) {
            setDroppedFiles([...fileList]);
        }
    };

    return (
        <Upload
            onChange={onChange}
            beforeUpload={beforeUpload}
            showUploadList={false}
            customRequest={(options) =>
                customRequest(options, droppedFiles, loadLocalFile)
            }
            multiple
        >
            <Link
                // Redirect to /viewer if necessary and/or clear out viewer
                to={{
                    pathname: VIEWER_PATHNAME,
                    state: { localFile: true },
                }}
            >
                <Button type="ghost">From your device</Button>
            </Link>
        </Upload>
    );
};

export default LocalFileUpload;
