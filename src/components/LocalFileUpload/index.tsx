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

import styles from "./style.css";

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

/*
Order of operations for this Antd Upload component (when not triggered externally):
1. User selects file(s) and clicks "Open" in system file upload dialog
2. beforeUpload is called n times (n = number of files)
3. customRequest is called n times
4. If customRequest results in success (onSuccess), file.status changes to "done".
   If customRequest results in error, file.status changes to "error".
   These two changes trigger onChange.
*/

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
        className: styles.fileUpload,
        multiple: true,
        showUploadList: {
            removeIcon: <CloseOutlined />,
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
        <Upload {...uploadProps}>
            <Link
                // Redirect to /viewer if necessary and/or clear out viewer
                to={{
                    pathname: VIEWER_PATHNAME,
                    state: { localFile: true },
                }}
            >
                {children || <Button>Select file</Button>}
            </Link>
        </Upload>
    );
};

/**
 * UI for uploading local files.
 *
 * May either upload immediately when the user picks file(s) in the system
 * dialog (default), or stage files until triggered to upload by a parent.
 * To have the component list selected files and wait to load, pass in a ref:
 *
 * ```
 * const uploadRef = React.useRef<FileUploadRef>(null);
 * return <LocalFileUpload ref={uploadRef} {...otherProps}>;
 * ```
 * ...then call `uploadRef.current.upload();` to begin loading files.
 */
export default forwardRef(LocalFileUpload);
