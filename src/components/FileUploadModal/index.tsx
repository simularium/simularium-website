import { Button, Form, Tabs } from "antd";
import { RcFile } from "antd/lib/upload";
import React, { useRef, useState } from "react";
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
import LocalFileUpload, { FileUploadRef } from "../LocalFileUpload";

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
    ...uploadActions
}) => {
    const [openTab, setOpenTab] = useState("device");
    const [noUrlInput, setNoUrlInput] = useState(true);
    const [noFileInput, setNoFileInput] = useState(true);
    const [urlForm] = Form.useForm();
    const fileUploadRef = useRef<FileUploadRef>(null);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoUrlInput(event.target.value.length === 0);
    };

    const onFileListChange = (fileList: RcFile[]) => {
        setNoFileInput(fileList.length === 0);
    };

    const disableLoad = openTab === "device" ? noFileInput : noUrlInput;

    const onLoadClick = () => {
        if (openTab === "device") {
            fileUploadRef.current?.upload();
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
                    onFileListChange={onFileListChange}
                    ref={fileUploadRef}
                    {...uploadActions}
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
