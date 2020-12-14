import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ActionCreator } from "redux";
import { Menu, Dropdown, Button } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    RequestLocalFileAction,
    RequestNetworkFileAction,
} from "../../state/metadata/types";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import LocalFileUpload from "../LocalFileUpload";
import { DownArrow } from "../Icons";

const styles = require("./style.css");

interface LoadFileMenuProps {
    isBuffering: boolean;
    selectFile: ActionCreator<RequestNetworkFileAction>;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
}

const LoadFileMenu = ({
    isBuffering,
    loadLocalFile,
    selectFile,
}: LoadFileMenuProps) => {
    const location = useLocation();
    const onClick = (trajectoryData: TrajectoryDisplayData) => {
        if (location.pathname === VIEWER_PATHNAME) {
            selectFile({
                name: trajectoryData.id,
                title: trajectoryData.title,
            });
        }
    };
    const menu = (
        <Menu theme="dark" className={styles.menu}>
            <Menu.Item>
                <LocalFileUpload loadLocalFile={loadLocalFile} />
            </Menu.Item>
            <Menu.SubMenu
                title="Load existing model"
                popupClassName={styles.submenu}
                popupOffset={[-0.45, -4]}
            >
                {TRAJECTORIES.map((trajectory) => (
                    <Menu.Item key={trajectory.id}>
                        <Link
                            onClick={() => onClick(trajectory)}
                            to={{
                                pathname: VIEWER_PATHNAME,
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
        <Dropdown overlay={menu} placement="bottomRight" disabled={isBuffering}>
            <Button
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                type="primary"
            >
                Load model {DownArrow}
            </Button>
        </Dropdown>
    );
};

export default LoadFileMenu;
