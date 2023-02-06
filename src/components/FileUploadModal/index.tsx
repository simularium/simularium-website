import { Button, Form, Tabs } from "antd";
import { RcFile } from "antd/lib/upload";
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
import UrlUploadForm from "./url-upload-form";
import LocalFileUpload from "../LocalFileUpload";
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
    clearSimulariumFile,
    loadLocalFile,
    setViewerStatus,
    setError,
}) => {
    const [openTab, setOpenTab] = useState("device");
    const [noUrlInput, setNoUrlInput] = useState(true);
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [urlForm] = Form.useForm();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoUrlInput(event.target.value.length === 0);
    };

    const disableLoad =
        openTab === "device" ? fileList.length === 0 : noUrlInput;

    const onLoadClick = () => {
        if (openTab === "device") {
            uploadFiles(
                fileList,
                clearSimulariumFile,
                loadLocalFile,
                setViewerStatus,
                setError
            );
            closeModal();
        } else {
            urlForm.submit();
            // Modal closed by reload
        }
    };

    const tabItems = [
        {
            label: "From your device",
            key: "device",
            children: (
                <LocalFileUpload
                    fileList={fileList}
                    onFileListChange={setFileList}
                    multiple
                />
            ),
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
                activeKey={openTab}
                onChange={setOpenTab}
                size="large"
            />
        </CustomModal>
    );
};

export default FileUploadModal;
