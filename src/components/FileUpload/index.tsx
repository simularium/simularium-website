import React, { useState } from "react";
import { Upload, message, Button, Icon } from "antd";

const FileUpload = (props) => {
    const [fileData, setFileData] = useState<{ [key: string]: any }>({});
    const onChange = (info) => {
        if (info.file.status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
            console.log(fileData);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    return (
        <Upload
            onChange={onChange}
            customRequest={({ file, onSuccess, onError }) => {
                file.text()
                    .then((text) => JSON.parse(text))
                    .then((data) => {
                        setFileData(data);
                    })
                    .then(() =>
                        onSuccess(
                            {
                                name: file.name,
                                status: "done",
                                url: "",
                            },
                            file
                        )
                    )
                    .catch((error) => {
                        onError(error);
                    });
            }}
        >
            <Button>
                <Icon type="upload" /> Click to Upload
            </Button>
        </Upload>
    );
};

export default FileUpload;
