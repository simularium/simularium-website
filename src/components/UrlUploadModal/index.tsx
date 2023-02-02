import { Button, Form, Input, message, Modal, Tabs, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import React, { useState } from "react";
import { ActionCreator } from "redux";
import { Link, useHistory } from "react-router-dom";

import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";
import {
    ClearSimFileDataAction,
    RequestLocalFileAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";

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
    const history = useHistory();

    const closeModal = () => {
        setIsModalVisible(false);
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

    // WEB LOADING METHODS

    const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoUrlInput(event.target.value.length === 0);
    };

    const loadTrajectoryUrl = ({ url }: UrlFormValues) => {
        history.push(`${VIEWER_PATHNAME}?trajUrl=${url}`);
        location.reload();
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

    const extraInfo = (
        <p className={styles.extraInfo}>
            We currently support public Dropbox, Google Drive, and Amazon S3
            links.{" "}
            <a
                href={`${TUTORIAL_PATHNAME}#share-a-link`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn more.
            </a>
        </p>
    );

    return (
        <Modal
            className={styles.modal}
            title="Choose a Simularium file to load"
            open
            footer={
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
            }
            onCancel={closeModal}
            width={525}
            centered
        >
            <Tabs
                defaultActiveKey="device"
                size="large"
                onChange={setCurrentTab}
            >
                <Tabs.TabPane tab="From your device" key="device">
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
                </Tabs.TabPane>
                <Tabs.TabPane tab="From the web" key="web">
                    <Form
                        form={urlForm}
                        layout="vertical"
                        requiredMark={false}
                        onFinish={loadTrajectoryUrl}
                    >
                        <Form.Item
                            name="url"
                            label="Enter the URL to a public .simularium file"
                            extra={extraInfo}
                            rules={[
                                {
                                    type: "url",
                                    message: "!\u20DD Please input a valid URL",
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                placeholder="https://.../example.simularium"
                                size="large"
                                onChange={handleUrlInput}
                                autoFocus={true}
                            />
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    );
};

export default UrlUploadModal;
