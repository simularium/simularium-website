import * as React from "react";
import { useHistory } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import {
    ClearSimFileDataAction,
    isLocalFileInterface,
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
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
} from "../../state/viewer/types";

import styles from "./style.css";
import ShareTrajectoryButton from "../../components/ShareTrajectoryButton";
import DownloadTrajectoryMenu from "../../components/DownloadTrajectoryMenu";
import NavButton from "../../components/NavButton";

interface AppHeaderProps {
    simulariumFile: LocalSimFile | NetworkedSimFile;
    isBuffering: boolean;
    isNetworkedFile: boolean;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    changeToLocalSimulariumFile: ActionCreator<RequestLocalFileAction>;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
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
                <NavButton
                    className={styles.simulariumHome}
                    titleText="SIMULARIUM HOME"
                    buttonType="action"
                    clickHandler={() => {
                        history.push("/");
                    }}
                />
            </div>
            <ViewerTitle
                simulariumFileName={displayName}
                lastModified={lastModified}
            />
            <div className={styles.buttonContainer}>
                <LoadFileMenu
                    key="select"
                    selectFile={loadNetworkFile}
                    clearSimulariumFile={clearSimulariumFile}
                    loadLocalFile={loadLocalFile}
                    setViewerStatus={setViewerStatus}
                    isBuffering={isBuffering}
                    setError={setError}
                />
                <HelpMenu key="help" />
                <DownloadTrajectoryMenu
                    isBuffering={isBuffering}
                    simulariumFile={simulariumFile}
                    isNetworkedFile={isNetworkedFile}
                />
                <ShareTrajectoryButton
                    simulariumFile={simulariumFile}
                    isBuffering={isBuffering}
                />
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
    };
}

const dispatchToPropsMap = {
    changeToLocalSimulariumFile:
        trajectoryStateBranch.actions.changeToLocalSimulariumFile,
    changeToNetworkedFile: trajectoryStateBranch.actions.changeToNetworkedFile,
    clearSimulariumFile: trajectoryStateBranch.actions.clearSimulariumFile,
    setViewerStatus: viewerStateBranch.actions.setStatus,
    setError: viewerStateBranch.actions.setError,
};

export default connect(mapStateToProps, dispatchToPropsMap)(AppHeader);
