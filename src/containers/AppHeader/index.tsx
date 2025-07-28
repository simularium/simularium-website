import * as React from "react";
import { useHistory } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import {
    ClearSimFileDataAction,
    ConversionStatus,
    isLocalFileInterface,
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
    SetConversionStatusAction,
} from "../../state/trajectory/types";
import LoadFileMenu from "../../components/LoadFileMenu";
import ViewerTitle from "../../components/ViewerTitle";
import HelpMenu from "../../components/HelpMenu";
import { AicsLogo } from "../../components/Icons";
import { State } from "../../state/types";
import trajectoryStateBranch from "../../state/trajectory";
import viewerStateBranch from "../../state/viewer";
import {
    SetViewerStatusAction,
    SetErrorAction,
    DragOverViewerAction,
} from "../../state/viewer/types";
import { ButtonClass } from "../../constants/interfaces";
import ShareTrajectoryButton from "../../components/ShareTrajectoryButton";
import DownloadTrajectoryMenu from "../../components/DownloadTrajectoryMenu";
import { CustomButton } from "../../components/CustomButton";

import styles from "./style.css";

interface AppHeaderProps {
    simulariumFile: LocalSimFile | NetworkedSimFile;
    isBuffering: boolean;
    isNetworkedFile: boolean;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    changeToLocalSimulariumFile: ActionCreator<RequestLocalFileAction>;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
    conversionStatus: ConversionStatus;
    setConversionStatus: ActionCreator<SetConversionStatusAction>;
    fileIsDraggedOverViewer: boolean;
    dragOverViewer: ActionCreator<DragOverViewerAction>;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    simulariumFile,
    isBuffering,
    changeToLocalSimulariumFile: loadLocalFile,
    changeToNetworkedFile: loadNetworkFile,
    setViewerStatus,
    clearSimulariumFile,
    setError,
    isNetworkedFile,
    conversionStatus,
    setConversionStatus,
    fileIsDraggedOverViewer,
    dragOverViewer,
}) => {
    const history = useHistory();

    let lastModified = 0;
    let displayName = "";
    if (isLocalFileInterface(simulariumFile)) {
        displayName = simulariumFile.name;
        lastModified = simulariumFile.lastModified;
    } else if (isNetworkSimFileInterface(simulariumFile)) {
        displayName = simulariumFile.title;
    }

    return (
        <div className={styles.pageHeader}>
            <div className={styles.leftLinks}>
                <a
                    href="https://allencell.org"
                    title="Allen Cell Explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {AicsLogo}
                </a>
                <span className={styles.verticalBar}>|</span>
                <CustomButton
                    variant={ButtonClass.Action}
                    className={styles.simulariumHome}
                    titleText="SIMULARIUM HOME"
                    onClick={() => {
                        history.push("/");
                    }}
                />
            </div>
            <ViewerTitle
                simulariumFileName={displayName}
                lastModified={lastModified}
            />
            <div className={styles.buttonContainer}>
                <DownloadTrajectoryMenu
                    isBuffering={isBuffering}
                    simulariumFile={simulariumFile}
                    isNetworkedFile={isNetworkedFile}
                />
                <ShareTrajectoryButton
                    simulariumFile={simulariumFile}
                    isBuffering={isBuffering}
                />
                <LoadFileMenu
                    key="select"
                    selectFile={loadNetworkFile}
                    clearSimulariumFile={clearSimulariumFile}
                    loadLocalFile={loadLocalFile}
                    setViewerStatus={setViewerStatus}
                    isBuffering={isBuffering}
                    setError={setError}
                    conversionStatus={conversionStatus}
                    setConversionStatus={setConversionStatus}
                    handleDragOver={dragOverViewer}
                    fileIsDraggedOverViewer={fileIsDraggedOverViewer}
                />
                <HelpMenu />
            </div>
        </div>
    );
};

function mapStateToProps(state: State) {
    return {
        simulariumFile:
            trajectoryStateBranch.selectors.getSimulariumFile(state),
        isBuffering: viewerStateBranch.selectors.getIsBuffering(state),
        isNetworkedFile:
            trajectoryStateBranch.selectors.getIsNetworkedFile(state),
        conversionStatus:
            trajectoryStateBranch.selectors.getConversionStatus(state),
        fileIsDraggedOverViewer:
            viewerStateBranch.selectors.getFileDraggedOver(state),
    };
}

const dispatchToPropsMap = {
    changeToLocalSimulariumFile:
        trajectoryStateBranch.actions.changeToLocalSimulariumFile,
    changeToNetworkedFile: trajectoryStateBranch.actions.changeToNetworkedFile,
    clearSimulariumFile: trajectoryStateBranch.actions.clearSimulariumFile,
    setViewerStatus: viewerStateBranch.actions.setStatus,
    setError: viewerStateBranch.actions.setError,
    setConversionStatus: trajectoryStateBranch.actions.setConversionStatus,
    dragOverViewer: viewerStateBranch.actions.dragOverViewer,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AppHeader);
