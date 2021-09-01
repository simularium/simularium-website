import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";

const styles = require("./style.css");

const UrlUpload = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    let history = useHistory();

    const showModal = () => {
        if (history.location.pathname !== VIEWER_PATHNAME) {
            history.push(VIEWER_PATHNAME);
        }
        setIsModalVisible(true);
    };
    const closeModal = () => {
        setIsModalVisible(false);
    };

    const loadTrajectory = (values: any) => {
        history.push(`${VIEWER_PATHNAME}?trajUrl=${values.url}`);
        location.reload();
    };

    return (
        <>
            <Button type="ghost" onClick={showModal}>
                From a URL
            </Button>
            <Modal
                className={styles.modal}
                title="Load Model from URL"
                visible={isModalVisible}
                footer={null}
                onCancel={closeModal}
                width={700}
            >
                <p>Enter the URL to a public .simularium file</p>
                <Form
                    layout="inline"
                    requiredMark={false}
                    onFinish={loadTrajectory}
                >
                    <Form.Item
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: "Please input a URL",
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            placeholder="https://.../example.simularium"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Load
                        </Button>
                    </Form.Item>
                </Form>
                <p className={styles.currentlySupport}>
                    We currently support public Dropbox, Google Drive, and
                    Amazon S3 links.{" "}
                    <a
                        href={`${TUTORIAL_PATHNAME}#share-a-link`}
                        onClick={closeModal}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn more.
                    </a>
                </p>
            </Modal>
        </>
    );
};

export default UrlUpload;
