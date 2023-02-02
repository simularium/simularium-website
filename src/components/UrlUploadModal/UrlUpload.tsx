import React from "react";
import { Form, Input } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { useHistory } from "react-router-dom";

import { TUTORIAL_PATHNAME, VIEWER_PATHNAME } from "../../routes";

import styles from "./style.css";

type UrlFormValues = { url: string };
interface UrlUploadProps {
    form?: FormInstance<UrlFormValues>;
    onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const UrlUploadForm: React.FC<UrlUploadProps> = ({ form, onInputChange }) => {
    const history = useHistory();

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

    return (
        <Form
            form={form}
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
                    onChange={onInputChange}
                    autoFocus={true}
                />
            </Form.Item>
        </Form>
    );
};

export default UrlUploadForm;
