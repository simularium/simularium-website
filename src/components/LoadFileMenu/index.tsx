import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ActionCreator } from "redux";
import { MenuProps } from "antd";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    ClearSimFileDataAction,
    ConversionStatus,
    RequestLocalFileAction,
    RequestNetworkFileAction,
    SetConversionStatusAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";
import { ButtonClass, TrajectoryDisplayData } from "../../constants/interfaces";
import { VIEWER_PATHNAME } from "../../routes";
import { DownArrow } from "../Icons";
import FileUploadModal from "../FileUploadModal";
import CustomDropdown from "../CustomDropdown";
import {
    DropdownButton,
    DropdownRouterLink,
} from "../CustomDropdown/DropdownMenuItems";

interface LoadFileMenuProps {
    isBuffering: boolean;
    selectFile: ActionCreator<RequestNetworkFileAction>;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    loadLocalFile: ActionCreator<RequestLocalFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
    conversionStatus: ConversionStatus;
    setConversionStatus: ActionCreator<SetConversionStatusAction>;
}

const LoadFileMenu = ({
    clearSimulariumFile,
    isBuffering,
    loadLocalFile,
    selectFile,
    setViewerStatus,
    setError,
    conversionStatus,
    setConversionStatus,
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

    const openConversionForm = () => {
        setConversionStatus({ status: ConversionStatus.NoServer });
    };

    const onClick = (trajectoryData: TrajectoryDisplayData) => {
        if (location.pathname === VIEWER_PATHNAME) {
            selectFile({
                name: trajectoryData.id,
                title: trajectoryData.title,
            });
        }
    };

    const items: MenuProps["items"] = [
        {
            key: "from-examples",
            label: (
                <DropdownButton isSubmenuTrigger={true}>
                    Example models
                </DropdownButton>
            ),
            expandIcon: false,
            popupOffset: [-0.45, -4],
            children: TRAJECTORIES.map((trajectory) => ({
                key: trajectory.id,
                label: (
                    <DropdownRouterLink
                        to={{
                            pathname: VIEWER_PATHNAME,
                            search: `?${URL_PARAM_KEY_FILE_NAME}=${trajectory.id}`,
                        }}
                        onClick={() => onClick(trajectory)}
                    >
                        {trajectory.title}
                        {trajectory.subtitle && `: ${trajectory.subtitle}`}
                    </DropdownRouterLink>
                ),
            })),
        },
        {
            key: "file-upload",
            label: (
                <DropdownButton onClick={showModal}>
                    Simularium file
                </DropdownButton>
            ),
        },
        {
            key: "file-convert",
            label: (
                <DropdownRouterLink
                    to={{ pathname: VIEWER_PATHNAME }}
                    onClick={openConversionForm}
                >
                    Import other file type
                </DropdownRouterLink>
            ),
        },
    ];

    const isDisabled =
        isBuffering || conversionStatus !== ConversionStatus.Inactive;

    return (
        <>
            <CustomDropdown
                items={items}
                titleText={"Load model"}
                icon={DownArrow}
                buttonType={ButtonClass.Primary}
                placement="bottomRight"
                disabled={isDisabled}
            />
            {/* 
                Conditionally rendering the modal this way instead of as a `visible` prop
                forces it to re-render every time it is opened, resetting the form inside.
            */}
            {isModalVisible && (
                <FileUploadModal
                    setIsModalVisible={setIsModalVisible}
                    clearSimulariumFile={clearSimulariumFile}
                    loadLocalFile={loadLocalFile}
                    setViewerStatus={setViewerStatus}
                    setError={setError}
                />
            )}
        </>
    );
};

export default LoadFileMenu;
