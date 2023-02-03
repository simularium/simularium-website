import React, { forwardRef, useState, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import { Button, message, Upload, UploadProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import { ActionCreator } from "redux";

import {
    ClearSimFileDataAction,
    RequestLocalFileAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";
import { VIEWER_PATHNAME } from "../../routes";
import uploadFiles from "./upload-local-files";

interface FileUploadProps {
    onFileListChange: (fileList: RcFile[]) => void;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    setError: ActionCreator<SetErrorAction>;
}

export interface FileUploadRef {
    upload: () => void;
}

type FileUploadRenderFunction = React.ForwardRefRenderFunction<
    FileUploadRef,
    FileUploadProps
>;

const LocalFileUpload: FileUploadRenderFunction = (
    {
        onFileListChange,
        loadLocalFile,
        setViewerStatus,
        clearSimulariumFile,
        setError,
        children,
    },
    ref
) => {
    const [fileList, _setFileList] = useState<RcFile[]>([]);
    const setFileList = (fileList: RcFile[]) => {
        _setFileList(fileList);
        if (onFileListChange) {
            onFileListChange(fileList);
        }
    };

    useImperativeHandle(ref, () => ({
        upload: () => {
            uploadFiles(
                fileList,
                clearSimulariumFile,
                loadLocalFile,
                setViewerStatus,
                setError
            );
            setFileList([]);
        },
    }));

    const uploadProps: UploadProps = {
        showUploadList: {
            removeIcon: <CloseOutlined style={{ color: "#d14040" }} />,
        },
        // Do not show Ant's paperclip icon next to listed files
        iconRender: () => null,

        beforeUpload: (_file, fileList) => {
            setFileList([...fileList]);
            // if ref was provided, wait for parent to call `upload`
            return !ref;
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file as RcFile);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        onChange: ({ file }) => {
            if (file.status === "done") {
                setFileList([]);
            } else if (file.status === "error") {
                message.error(`Failed to load ${file.name}`);
                setFileList([]);
            }
        },
        customRequest: (options) =>
            uploadFiles(
                fileList,
                clearSimulariumFile,
                loadLocalFile,
                setViewerStatus,
                setError,
                options
            ),

        fileList,
    };

    return (
        <Upload {...uploadProps} multiple>
            <Link
                // Redirect to /viewer if necessary and/or clear out viewer
                to={{
                    pathname: VIEWER_PATHNAME,
                    state: { localFile: true },
                }}
            >
                <Button>Select file</Button>
            </Link>
            {children}
        </Upload>
    );
};

export default forwardRef(LocalFileUpload);
