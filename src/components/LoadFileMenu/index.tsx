import * as React from "react";
import { Link } from "react-router-dom";
import { ActionCreator } from "redux";
import { Menu, Dropdown, Button } from "antd";

import { TRAJECTORY_FILES } from "../../constants";
import { RequestFileAction } from "../../state/metadata/types";

import LocalFileUpload from "../LocalFileUpload";

const styles = require("./style.css");

interface NetworkFileMenuProps {
    selectFile: ActionCreator<RequestFileAction>;
    loadLocalFile: ActionCreator<RequestFileAction>;
}

const LoadFileMenu = ({ selectFile, loadLocalFile }: NetworkFileMenuProps) => {
    const menu = (
        <Menu theme="dark" className={styles.menu}>
            <Menu.Item>
                <LocalFileUpload loadLocalFile={loadLocalFile} />
            </Menu.Item>
            <Menu.SubMenu title="Load existing model">
                {TRAJECTORY_FILES.map((fileName) => (
                    <Menu.Item
                        key={fileName}
                        onClick={() => {
                            selectFile({
                                name: `${fileName}`,
                                data: null,
                                dateModified: null,
                            });
                        }}
                    >
                        <Link to="/viewer">{fileName}</Link>
                    </Menu.Item>
                ))}
            </Menu.SubMenu>
        </Menu>
    );
    return (
        <Dropdown overlay={menu}>
            <Button
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                type="ghost"
            >
                Load model
            </Button>
        </Dropdown>
    );
};

export default LoadFileMenu;
