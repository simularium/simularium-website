import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";

const styles = require("./style.css");

const UrlUpload = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userInput, setUserInput] = useState("");
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
        setUserInput(event.target.value);
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
                width={525}
                centered
            >
                <Form
                    layout="vertical"
                    requiredMark={false}
                    onFinish={loadTrajectory}
                >
                    <Form.Item
                        name="url"
                        label="Enter the URL to a public .simularium file"
                        extra={extraInfo}
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: "Please input a URL",
                        //     },
                        // ]}
                    >
                        <Input
                            allowClear
                            placeholder="https://.../example.simularium"
                            size="large"
                            onChange={handleUserInput}
                        />
                    </Form.Item>
                    <Form.Item className={styles.submitButton}>
                        <Button
                            type="default"
                            htmlType="submit"
                            disabled={!userInput}
                        >
                            Load
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UrlUpload;
