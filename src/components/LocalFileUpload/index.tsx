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
        // FIXME: Link breaks upload popup
        // <Link
        //     // used to decide whether to clear out the viewer
        //     to={{
        //         pathname: VIEWER_PATHNAME,
        //         state: { localFile: true },
        //     }}
        // >
        <Upload
            onChange={onChange}
            beforeUpload={beforeUpload}
            showUploadList={false}
            customRequest={(options) =>
                customRequest(options, droppedFiles, loadLocalFile)
            }
            multiple={true}
        >
            <Button type="ghost">From your device</Button>
        </Upload>
        // </Link>
    );
};

export default LocalFileUpload;
