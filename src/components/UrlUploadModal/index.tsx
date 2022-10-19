import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";

const styles = require("./style.css");

interface UrlUploadModalProps {
    setIsModalVisible: (isModalVisible: boolean) => void;
}

const UrlUploadModal = ({
    setIsModalVisible,
}: UrlUploadModalProps): JSX.Element => {
    const [userInput, setUserInput] = useState("");
    const history = useHistory();

    const closeModal = () => {
        setIsModalVisible(false);
    };

    //forces focus on input field when modal is opened
    //if statement keeps tab targeting to the link
    useEffect(() => {
        const input = document.getElementsByClassName("ant-input")[
            document.getElementsByClassName("ant-input").length - 1
        ] as HTMLInputElement;
        const inputFocus = setInterval(() => {
            if (
                input !== document.activeElement &&
                document.activeElement &&
                !document.activeElement.classList.contains("link")
            )
                input.focus();
        }, 200);
        return () => clearInterval(inputFocus);
    });

    const loadTrajectory = (values: any) => {
        history.push(`${VIEWER_PATHNAME}?trajUrl=${values.url}`);
        location.reload();
    };

    const extraInfo = (
        <p className={styles.extraInfo}>
            We currently support public Dropbox, Google Drive, and Amazon S3
            links.{" "}
            <a
                className="link"
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
        <Modal
            className={styles.modal}
            title="Load Model from URL"
            visible
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
                        // autofocus FIXME: this doesn't work
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
    );
};

export default UrlUploadModal;
