import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input, Modal } from "antd";
import { RequestLocalFileAction } from "../../state/trajectory/types";

import { ActionCreator } from "redux";
import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";

const styles = require("./style.css");

const UrlUpload = () => {
    // TODO: change to false
    const [isModalVisible, setIsModalVisible] = useState(true);

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleButtonClick = (values: any) => {
        console.log(values.url);
    };
    const handleFinishFailed = (error: any) => {
        console.log(error);
    };

    return (
        // <Link
        //     // used to decide whether to clear out the viewer
        //     to={{
        //         pathname: VIEWER_PATHNAME,
        //         state: { localFile: true }, // FIXME:
        //     }}
        // />
        <>
            <Button type="ghost" onClick={showModal}>
                From a URL
            </Button>
            <Modal
                className={styles.modal}
                title="Load model from a URL"
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
                width={700}
            >
                <p>Provide the URL to your public Simularium file:</p>
                <Form
                    layout="inline"
                    requiredMark={false}
                    onFinish={handleButtonClick}
                    onFinishFailed={handleFinishFailed}
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
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Load
                        </Button>
                    </Form.Item>
                </Form>
                <p className={styles.currentlySupport}>
                    (We currently support public Dropbox, Google Drive, and
                    Amazon S3 links.{" "}
                    <a
                        href={`${TUTORIAL_PATHNAME}#share-a-link`}
                        onClick={handleCancel}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn more
                    </a>
                    )
                </p>
            </Modal>
        </>
    );
};

export default UrlUpload;
