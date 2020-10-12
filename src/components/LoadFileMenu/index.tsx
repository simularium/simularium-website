import * as React from "react";
import { Link } from "react-router-dom";
import { ActionCreator } from "redux";
import { Menu, Dropdown, Button } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { RequestFileAction } from "../../state/metadata/types";

import LocalFileUpload from "../LocalFileUpload";

const styles = require("./style.css");

interface NetworkFileMenuProps {
    selectFile: ActionCreator<RequestFileAction>;
    loadLocalFile: ActionCreator<RequestFileAction>;
}

const LoadFileMenu = ({ loadLocalFile }: NetworkFileMenuProps) => {
    const menu = (
        <Menu theme="dark" className={styles.menu}>
            <Menu.Item>
                <LocalFileUpload loadLocalFile={loadLocalFile} />
            </Menu.Item>
            <Menu.SubMenu title="Load existing model">
                {TRAJECTORIES.map((trajectory) => (
                    <Menu.Item key={trajectory.id}>
                        <Link
                            to={{
                                pathname: "/viewer",
                                search: `?${URL_PARAM_KEY_FILE_NAME}=${
                                    trajectory.id
                                }`,
                            }}
                        >
                            {trajectory.title}
                        </Link>
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
