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

const enum UploadTab {
    // this version of antd requires tab keys to be strings
    Device = "d",
    Web = "w",
}

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
    const [openTab, setOpenTab] = useState<string>(UploadTab.Device);
    const [noUrlInput, setNoUrlInput] = useState(true);
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [urlForm] = Form.useForm();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const onUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Form subcomponent takes care of its own submit behavior
        // all we care about is if input is present or not
        setNoUrlInput(event.target.value.length === 0);
    };

    // Disable load button when the current tab does not yet have any input
    // (device: no files have been selected; web: URL input box is empty)
    const disableLoad =
        openTab === UploadTab.Device ? fileList.length === 0 : noUrlInput;

    const onLoadClick = () => {
        if (openTab === UploadTab.Device) {
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
            key: UploadTab.Device,
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
            key: UploadTab.Web,
            children: <UrlUploadForm form={urlForm} onChange={onUrlInput} />,
        },
    ];

    const footerButtons = (
        <>
            <Button
                className="primary-button"
                disabled={disableLoad}
                onClick={onLoadClick}
            >
                Load
            </Button>
            <Button className="secondary-button" onClick={closeModal}>
                Cancel
            </Button>
        </>
    );

    return (
        <CustomModal
            closeHandler={closeModal}
            className={styles.uploadModal}
            titleText="Choose a Simularium file to load"
            footerButtons={footerButtons}
            width={525}
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
