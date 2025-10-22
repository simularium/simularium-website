import React from "react";
import { Link } from "react-router-dom";
import { message, Upload, UploadProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import classNames from "classnames";

import { ButtonClass } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import { CustomButton } from "../CustomButton";
import { Drag } from "../Icons";

import styles from "./style.css";

interface FileUploadProps {
    fileList: RcFile[];
    onFileListChange: (fileList: RcFile[]) => void;
    // props that may be useful to pass down to `Upload`
    accept?: string;
    directory?: boolean;
    disabled?: boolean;
    maxCount?: number;
    multiple?: boolean;
    name?: string;
    children?: React.ReactNode;
}

/**
 * UI for uploading local files.
 * Does not upload on its own, but provides a file list
 * to custom requests in the parent via `onFileListChange`.
 */
const LocalFileUpload: React.FC<FileUploadProps> = ({
    fileList,
    onFileListChange,
    children,
    ...uploadConfigProps
}) => {
    const uploadPresetProps: UploadProps = {
        className: classNames(styles.fileUpload, {
            [styles.listEmpty]: fileList.length === 0,
        }),
        showUploadList: {
            removeIcon: <CloseOutlined />,
        },
        // Do not show Ant's paperclip icon next to listed files
        iconRender: () => null,

        beforeUpload: (_file, fileList) => {
            onFileListChange([...fileList]);
            // don't submit, just gather files in a list
            return false;
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file as RcFile);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            onFileListChange(newFileList);
        },
        onChange: ({ file }) => {
            if (file.status === "error") {
                message.error(`Failed to load ${file.name}`);
                onFileListChange([]);
            }
        },
        fileList,
    };

    return (
        <Upload {...uploadPresetProps} {...uploadConfigProps}>
            <div className={styles.drag}>
                {" "}
                {Drag} Drag and drop a .simularium file anywhere in this window
                or browse to a location.{" "}
            </div>
            <Link
                // Redirect to /viewer if necessary and/or clear out viewer
                to={{
                    pathname: VIEWER_PATHNAME,
                    state: { localFile: true },
                }}
            >
                {children || (
                    <CustomButton variant={ButtonClass.LightPrimary}>
                        Browse
                    </CustomButton>
                )}
            </Link>
        </Upload>
    );
};

export default LocalFileUpload;
