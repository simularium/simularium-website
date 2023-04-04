import React, { useState } from "react";
import { Upload, Select, Divider, Button, Input, Form, Row, Col } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import styles from "./style.css";
// import theme from "../../styles/light-theme.css";
import theme from "../CustomModal/light-theme.css";
import classNames from "classnames";
import ConversionFormSubmenu from "../ConversionFormSubmenu";
import { Delete } from "../Icons";

interface ConversionFormOverlayProps {
    [key: string]: any;
    active: boolean;
}

const fileList: UploadFile[] = [
    {
        uid: "0",
        name: "xxx.png",
    },
];

const selectOptions = [
    { value: "cytosim", label: "cytosim" },
    { value: "cellPACK", label: "cellPACK" },
    { value: "Smoldyn", label: "Smoldyn" },
    { value: "SpringSaLaD", label: "SpringSaLaD" },
];

const ConversionFormOverlay = ({
    active,
}: ConversionFormOverlayProps): JSX.Element | null => {
    const [showTarget, setVisibility] = useState(true);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isFileLoaded, setFileLoaded] = useState<boolean>(false);

    const handleImport = () => {
        //TODO
        // this function will take the file type, file, and user specifications and make a fetch request
        // do we need to do a POST or store the uploaded file on the server before sending it to simulariumio?
        // define interface for request object
        // diff interfaces for diff file types or is one possible...
        // get file type
        // each file type will have different requirements in simulariumio....
        // get file
        // get user options via menus
        // build instace of interface
        // make POST request with request data
        // where to make request to
        // toggle state to Loading/Importing
        // render loading overlay screen
        // render modals for cancellations or failure to import
    };

    const conversionFormOverlay = (
        <div className={classNames(styles.container, theme.lightTheme)}>
            <h3 className={styles.title}>Import a non-native file type</h3>
            <h3>
                Convert and import a non-simularium file by providing the
                following information
            </h3>
            <h3 className={styles.provide}>
                {" "}
                Provide file information (required){" "}
            </h3>
            <h3 className={styles.selecttitle}>Simulation Engine</h3>
            <div className={styles.uploadContainer}>
                <Select
                    className={styles.selectorBox}
                    bordered={true}
                    defaultValue="Select"
                    options={selectOptions}
                />
                <Upload
                    className={styles.upload}
                    listType="text"
                    multiple={false}
                    showUploadList={{
                        showPreviewIcon: false,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                    }}
                    defaultFileList={[...fileList]}
                    onChange={() => {
                        setFileLoaded(true);
                        console.log(fileList);
                    }}
                >
                    <Button type="default">Select file</Button>
                </Upload>
            </div>
            <Divider orientation="right" orientationMargin={400}>
                {" "}
            </Divider>
            {/* this div needs conditional rendering when Next button is hit */}
            <div>
                <h3 className={styles.provide}>
                    Provide display information (optional)
                </h3>
                <h3>
                    You can import your model now with defaults, or specify how
                    you want your Smoldyn trajectory displayed below.
                </h3>
                <h3 className={styles.provide}> </h3>
                <h3 className={styles.selecttitle}>Trajectory title</h3>
                <Input placeholder="Start typing..." />
                <Divider orientation="right" orientationMargin={400}>
                    {" "}
                </Divider>
            </div>
            <ConversionFormSubmenu
                // title="Particle display specification (recommended)"
                // subtitle="Particle names must exactly match the particle names in your Smoldyn trajectory to be recognized."
                option="particle"
            />
            <ConversionFormSubmenu option="viewport" />
            <ConversionFormSubmenu option="time" />
            <ConversionFormSubmenu option="spatial" />
            <Button type="default">Cancel</Button>
            <Button type="primary">Import</Button>
        </div>
    );

    if (active) {
        return conversionFormOverlay;
    } else {
        return null;
    }
};

export default ConversionFormOverlay;
