import { Button, Form, message, Tabs } from "antd";
import { RcFile, UploadProps } from "antd/lib/upload";
import React, { useState } from "react";
import { ActionCreator } from "redux";

import {
    ClearSimFileDataAction,
    RequestLocalFileAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";

import CustomModal from "../CustomModal";
import UrlUploadForm from "./UrlUploadForm";
import LocalUpload from "./LocalUpload";
import uploadFiles from "./upload-local-files";
import styles from "./style.css";

interface FileUploadModalProps {
    setIsModalVisible: (isModalVisible: boolean) => void;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    setError: ActionCreator<SetErrorAction>;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    setIsModalVisible,
    loadLocalFile,
    setViewerStatus,
    clearSimulariumFile,
    setError,
}) => {
    const [openTab, setOpenTab] = useState("dev");
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [noUrlInput, setNoUrlInput] = useState(true);
    const [urlForm] = Form.useForm();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoUrlInput(event.target.value.length === 0);
    };

    const uploadProps: UploadProps = {
        beforeUpload: (_file, fileList) => {
            setFileList(fileList);
            // defer upload until user presses "Load"
            return false;
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file as RcFile);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        onChange: ({ file }) => {
            if (file.status === "error") {
                setFileList([]);
                message.error(`Failed to load ${file.name}`);
            }
        },
        fileList: fileList,
    };

    const disableLoad = openTab === "dev" ? fileList.length === 0 : noUrlInput;

    const onLoadClick = () => {
        if (openTab === "dev") {
            uploadFiles(
                fileList,
                clearSimulariumFile,
                loadLocalFile,
                setViewerStatus,
                setError
            );
            setFileList([]);
            closeModal();
        } else {
            urlForm.submit();
            setNoUrlInput(true);
            // Modal closed by reload
        }
    };

    const tabItems = [
        {
            label: "From your device",
            key: "dev",
            children: <LocalUpload {...uploadProps} multiple />,
        },
        {
            label: "From the web",
            key: "web",
            children: <UrlUploadForm form={urlForm} onChange={onUrlInput} />,
        },
    ];

    const footerButtons = (
        <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" disabled={disableLoad} onClick={onLoadClick}>
                Load
            </Button>
        </>
    );

    return (
        <CustomModal
            className={styles.uploadModal}
            title="Choose a Simularium file to load"
            open
            footer={footerButtons}
            onCancel={closeModal}
            width={525}
            centered
        >
            <Tabs
                items={tabItems}
                defaultActiveKey="dev"
                size="large"
                onChange={setOpenTab}
            />
        </CustomModal>
    );
};

export default FileUploadModal;
