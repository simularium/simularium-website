import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ActionCreator } from "redux";
import { Menu, Dropdown, Button } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { RequestFileAction } from "../../state/metadata/types";

import LocalFileUpload from "../LocalFileUpload";
import { TrajectoryDisplayData } from "../../constants/interfaces";

const styles = require("./style.css");

interface NetworkFileMenuProps {
    selectFile: ActionCreator<RequestFileAction>;
    loadLocalFile: ActionCreator<RequestFileAction>;
}

const LoadFileMenu = ({ loadLocalFile, selectFile }: NetworkFileMenuProps) => {
    const location = useLocation();
    const onClick = (trajectoryData: TrajectoryDisplayData) => {
        console.log(location);
        if (location.pathname === "/viewer") {
            selectFile({
                name: `${trajectoryData.id}.${trajectoryData.extension}`,
            });
        }
    };
    const menu = (
        <Menu theme="dark" className={styles.menu}>
            <Menu.Item>
                <LocalFileUpload loadLocalFile={loadLocalFile} />
            </Menu.Item>
            <Menu.SubMenu title="Load existing model">
                {TRAJECTORIES.map((trajectory) => (
                    <Menu.Item key={trajectory.id}>
                        <Link
                            onClick={() => onClick(trajectory)}
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
