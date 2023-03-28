import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ActionCreator } from "redux";
import { Menu, Dropdown, Button } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    ClearSimFileDataAction,
    ConvertFileAction,
    RequestLocalFileAction,
    RequestNetworkFileAction,
} from "../../state/trajectory/types";
import { ViewerStatus } from "../../state/viewer/types";
import { getStatus } from "../../state/viewer/selectors";
import { State } from "../../state/types";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import LocalFileUpload from "../LocalFileUpload";
import UrlUploadModal from "../UrlUploadModal";
import { DownArrow } from "../Icons";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";

import styles from "./style.css";
import { connect } from "react-redux";
import { VIEWER_IMPORTING } from "../../state/viewer/constants";

interface LoadFileMenuProps {
    isBuffering: boolean;
    selectFile: ActionCreator<RequestNetworkFileAction>;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
    viewerStatus: ViewerStatus;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
    initializeFileConversion: ActionCreator<ConvertFileAction>;
}

const LoadFileMenu = ({
    clearSimulariumFile,
    initializeFileConversion,
    isBuffering,
    loadLocalFile,
    selectFile,
    viewerStatus,
    setViewerStatus,
    setError,
}: LoadFileMenuProps): JSX.Element => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const location = useLocation();
    const history = useHistory();

    const showModal = () => {
        if (history.location.pathname !== VIEWER_PATHNAME) {
            history.push(VIEWER_PATHNAME);
        }
        setIsModalVisible(true);
    };

    const onClick = (trajectoryData: TrajectoryDisplayData) => {
        if (location.pathname === VIEWER_PATHNAME) {
            selectFile({
                name: trajectoryData.id,
                title: trajectoryData.title,
            });
        }
    };

    const isDisabled = (viewerStatus === VIEWER_IMPORTING || isBuffering) 


    const menu = (
        <Menu theme="dark" className={styles.menu}>
            <Menu.SubMenu
                title="From examples"
                popupClassName={styles.submenu}
                popupOffset={[-0.45, -4]}
                key="from-examples"
            >
                {TRAJECTORIES.map((trajectory) => (
                    <Menu.Item key={trajectory.id}>
                        <Link
                            onClick={() => onClick(trajectory)}
                            to={{
                                pathname: VIEWER_PATHNAME,
                                search: `?${URL_PARAM_KEY_FILE_NAME}=${trajectory.id}`,
                            }}
                        >
                            {trajectory.title}
                            {trajectory.subtitle && `: ${trajectory.subtitle}`}
                        </Link>
                    </Menu.Item>
                ))}
            </Menu.SubMenu>
            <Menu.Item key="url-upload">
                <Button type="ghost" onClick={showModal}>
                    From a URL
                </Button>
            </Menu.Item>
            <Menu.Item key="local-file-upload">
                <LocalFileUpload
                    clearSimulariumFile={clearSimulariumFile}
                    loadLocalFile={loadLocalFile}
                    setViewerStatus={setViewerStatus}
                    setError={setError}
                />
            </Menu.Item>
            <Menu.Item>
                {" "}
                <Button type="ghost" onClick={initializeFileConversion}>
                    Import other file type
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown
                overlay={menu}
                placement="bottomRight"
                disabled={isDisabled}
            >
                <Button
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                    type="primary"
                >
                    Load model {DownArrow}
                </Button>
            </Dropdown>
            {/* 
            1. Putting UrlUploadModal inside Menu.Item causes keyboard bugs.
               https://github.com/ant-design/ant-design/issues/34125
            2. Conditionally rendering the modal this way instead of as a `visible` prop
               forces it to re-render every time it is opened, resetting the form inside.
            */}
            {isModalVisible && (
                <UrlUploadModal setIsModalVisible={setIsModalVisible} />
            )}
        </>
    );
};

function mapStateToProps(state: State) {
    return {
        viewerStatus: getStatus(state),
    };
}

export default connect(mapStateToProps)(LoadFileMenu);
