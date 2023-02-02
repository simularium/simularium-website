import { Button, Form, message, Tabs, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import React, { useState } from "react";
import { ActionCreator } from "redux";
import { Link } from "react-router-dom";

import { VIEWER_PATHNAME } from "../../routes";
import {
    ClearSimFileDataAction,
    RequestLocalFileAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";

import CustomModal from "../CustomModal";
import UrlUploadForm from "./UrlUpload";
import customRequest from "./custom-request-upload";
import styles from "./style.css";

interface UrlUploadModalProps {
    setIsModalVisible: (isModalVisible: boolean) => void;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    setError: ActionCreator<SetErrorAction>;
}

type UrlFormValues = { url: string };

const UrlUploadModal: React.FC<UrlUploadModalProps> = ({
    setIsModalVisible,
    loadLocalFile,
    setViewerStatus,
    clearSimulariumFile,
    setError,
}) => {
    const [currentTab, setCurrentTab] = useState("device");
    const [fileList, setFileList] = useState<File[]>([]);
    const [noUrlInput, setNoUrlInput] = useState(true);

    const [urlForm] = Form.useForm<UrlFormValues>();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoUrlInput(event.target.value.length === 0);
    };

    // FILE LOADING METHODS

    const beforeUpload = (_file: File, fileList: File[]) => {
        setFileList([...fileList]);
        // defer upload until user presses "Load"
        return false;
    };

    const onRemoveFile = ({ originFileObj }: UploadFile) => {
        if (!originFileObj) return;
        const index = fileList.indexOf(originFileObj);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    };

    // TODO move to customRequest
    const onUploadChange = ({ file }: UploadChangeParam) => {
        if (file.status === "done") {
            setFileList([]);
        } else if (file.status === "error") {
            message.error(`Failed to load ${file.name}`);
            setFileList([]);
        }
    };

    const loadBtnDisabled =
        currentTab === "device" ? fileList.length === 0 : noUrlInput;
    const onLoadClick = () => {
        if (currentTab === "device") {
            customRequest(
                fileList,
                clearSimulariumFile,
                loadLocalFile,
                setViewerStatus,
                setError
            );
            closeModal();
        } else {
            urlForm.submit();
        }
    };

    const tabItems = [
        {
            label: "From your device",
            key: "device",
            children: (
                <Upload
                    onChange={onUploadChange}
                    onRemove={onRemoveFile}
                    beforeUpload={beforeUpload}
                    multiple
                >
                    <Link
                        // Redirect to /viewer if necessary and/or clear out viewer
                        to={{
                            pathname: VIEWER_PATHNAME,
                            state: { localFile: true },
                        }}
                    >
                        <Button>Select file</Button>
                    </Link>
                </Upload>
            ),
        },
        {
            label: "From the web",
            key: "web",
            children: (
                <UrlUploadForm form={urlForm} onInputChange={handleUrlInput} />
            ),
        },
    ];

    const footerButtons = (
        <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button
                type="primary"
                htmlType="submit"
                disabled={loadBtnDisabled}
                onClick={onLoadClick}
            >
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
                defaultActiveKey="device"
                size="large"
                onChange={setCurrentTab}
            />
        </CustomModal>
    );
};

export default UrlUploadModal;
