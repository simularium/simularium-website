import React from "react";
import { Button, Upload, UploadProps } from "antd";
import { Link } from "react-router-dom";
import { VIEWER_PATHNAME } from "../../routes";

const LocalUpload: React.FC<UploadProps> = (props) => (
    <Upload {...props}>
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

export default LocalUpload;
