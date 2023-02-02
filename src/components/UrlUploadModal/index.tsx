import { Button, Form, Input, Modal, Tabs, Upload } from "antd";
import React, { useState } from "react";
import { ActionCreator } from "redux";
import { useHistory } from "react-router-dom";

import LocalFileUpload from "../LocalFileUpload";
import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";
import {
    ClearSimFileDataAction,
    RequestLocalFileAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";

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
    const [noUrlInput, setNoUrlInput] = useState(true);
    const [urlForm] = Form.useForm<UrlFormValues>();
    const history = useHistory();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const loadTrajectoryUrl = ({ url }: UrlFormValues) => {
        history.push(`${VIEWER_PATHNAME}?trajUrl=${url}`);
        location.reload();
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

    const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoUrlInput(event.target.value.length === 0);
    };

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
                        disabled={noUrlInput}
                        onClick={urlForm.submit}
                    >
                        Load
                    </Button>
                </>
            }
            onCancel={closeModal}
            width={525}
            centered
        >
            <Tabs defaultActiveKey="device" size="large">
                <Tabs.TabPane tab="From your device" key="device">
                    <LocalFileUpload
                        clearSimulariumFile={clearSimulariumFile}
                        loadLocalFile={loadLocalFile}
                        setViewerStatus={setViewerStatus}
                        setError={setError}
                    >
                        <Button>Select file</Button>
                    </LocalFileUpload>
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
                                onChange={handleUserInput}
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
