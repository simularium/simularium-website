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

/*
Order of operations for this Antd Upload component:

1. User selects file(s) and clicks "Open" in system file upload dialog
2. beforeUpload is called n times (n = number of files)
3. customRequest is called n times
4. If customRequest results in success (onSuccess), file.status changes to "done".
   If customRequest results in error, file.status changes to "error".
   These two changes trigger onChange.
*/

const LocalFileUpload = ({ loadLocalFile }: FileUploadProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            setSelectedFiles([]);
        } else if (file.status === "error") {
            message.error(`${file.name} failed to load.`);
            setSelectedFiles([]);
        }
    };

    const beforeUpload = (file: File, fileList: File[]) => {
        if (selectedFiles.length === 0) {
            setSelectedFiles([...fileList]);
        }
    };

    return (
        <Upload
            onChange={onChange}
            beforeUpload={beforeUpload}
            showUploadList={false}
            customRequest={(options) =>
                customRequest(options, selectedFiles, loadLocalFile)
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
