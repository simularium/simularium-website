import * as React from "react";
import { ActionCreator } from "redux";
import { Menu, Dropdown, Button } from "antd";

import { TRAJECTORY_FILES } from "../../constants";
import { RequestFileAction } from "../../state/metadata/types";

import { DownArrow } from "../Icons";

interface NetworkFileMenuProps {
    selectFile: ActionCreator<RequestFileAction>;
}

const NetworkFileMenu = ({ selectFile }: NetworkFileMenuProps) => {
    const menu = (
        <Menu>
            {TRAJECTORY_FILES.map((fileName) => (
                <Menu.Item
                    key={fileName}
                    onClick={() =>
                        selectFile({
                            name: `${fileName}`,
                            data: null,
                            dateModified: null,
                        })
                    }
                >
                    {fileName}
                </Menu.Item>
            ))}
        </Menu>
    );
    return (
        <Dropdown overlay={menu}>
            <Button
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                type="ghost"
            >
                Load Existing Simularium Model {DownArrow}
            </Button>
        </Dropdown>
    );
};

export default NetworkFileMenu;
