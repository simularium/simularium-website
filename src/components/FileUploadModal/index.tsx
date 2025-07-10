import { Form, Tabs } from "antd";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { ActionCreator } from "redux";
import classNames from "classnames";

import {
    ClearSimFileDataAction,
    RequestLocalFileAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";
import { ButtonClass } from "../../constants/interfaces";

import CustomModal from "../CustomModal";
import { CustomButton } from "../CustomButton";
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
    fileIsDraggedOverViewer: boolean;
    handleDragOver: (e: DragEvent) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
    setIsModalVisible,
    clearSimulariumFile,
    loadLocalFile,
    setViewerStatus,
    setError,
    fileIsDraggedOverViewer,
    handleDragOver,
}) => {
    const [openTab, setOpenTab] = useState<string>(UploadTab.Device);
    const [noUrlInput, setNoUrlInput] = useState(true);
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [urlForm] = Form.useForm();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (!fileIsDraggedOverViewer) return;

        const handleWindowDrop = () => {
            closeModal();
        };

        window.addEventListener("drop", handleWindowDrop);
        return () => window.removeEventListener("drop", handleWindowDrop);
    }, [fileIsDraggedOverViewer]);

    const fileDragClass = fileIsDraggedOverViewer
        ? styles.fileDragged
        : undefined;

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
            <CustomButton
                variant={ButtonClass.LightPrimary}
                disabled={disableLoad}
                onClick={onLoadClick}
            >
                Load
            </CustomButton>
            <CustomButton
                variant={ButtonClass.LightSecondary}
                onClick={closeModal}
            >
                Cancel
            </CustomButton>
        </>
    );

    return (
        <CustomModal
            closeHandler={closeModal}
            className={classNames(styles.uploadModal, fileDragClass)}
            titleText="Choose a Simularium file to load"
            footerButtons={footerButtons}
            width={525}
            wrapClassName={fileDragClass}
            wrapProps={{
                onDragOver: (e: DragEvent) => handleDragOver(e),
            }}
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
