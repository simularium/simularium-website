import React from "react";
import { Link } from "react-router-dom";
import { Upload, message, Button } from "antd";
import { RequestLocalFileAction } from "../../state/trajectory/types";
import { UploadChangeParam } from "antd/lib/upload";

import { ActionCreator } from "redux";
import { VIEWER_PATHNAME } from "../../routes";
interface FileUploadProps {
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
}

const styles = require("./style.css");

const UrlUpload = () => {
    return (
        <Link
            // used to decide whether to clear out the viewer
            to={{
                pathname: VIEWER_PATHNAME,
                state: { localFile: true },
            }}
        >
            <Button type="ghost">From a URL</Button>
        </Link>
    );
};

export default UrlUpload;
