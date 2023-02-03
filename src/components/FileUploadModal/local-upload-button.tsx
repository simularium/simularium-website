import React from "react";
import { Button, Upload, UploadProps } from "antd";
import { Link } from "react-router-dom";
import { VIEWER_PATHNAME } from "../../routes";
import { CloseOutlined } from "@ant-design/icons";

const LocalUploadButton: React.FC<UploadProps> = (props) => (
    <Upload
        showUploadList={{
            removeIcon: <CloseOutlined style={{ color: "#d14040" }} />,
        }}
        // Do not show Ant's paperclip icon next to listed files
        iconRender={() => null}
        {...props}
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
);

export default LocalUploadButton;
