import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input, Modal } from "antd";
import { RequestLocalFileAction } from "../../state/trajectory/types";

import { ActionCreator } from "redux";
import { VIEWER_PATHNAME } from "../../routes";
interface FileUploadProps {
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
}

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

    return (
        <Link
            // used to decide whether to clear out the viewer
            to={{
                pathname: VIEWER_PATHNAME,
                state: { localFile: true }, // FIXME:
            }}
        >
            <Button type="ghost" onClick={showModal}>
                From a URL
            </Button>
            <Modal
                title="title"
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <Form>
                    <Form.Item>
                        <Input placeholder="your URL here" allowClear />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Link>
    );
};

export default UrlUpload;
