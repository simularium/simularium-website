import * as React from "react";
import { Link } from "react-router-dom";
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

const styles = require("./style.css");

interface AppHeaderProps {
    simulariumFile: LocalSimFile | NetworkedSimFile;
    isBuffering: boolean;
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    changeToLocalSimulariumFile: ActionCreator<RequestLocalFileAction>;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
    setError: ActionCreator<SetErrorAction>;
}

class AppHeader extends React.Component<AppHeaderProps> {
    public render(): JSX.Element {
        const {
            simulariumFile,
            isBuffering,
            changeToLocalSimulariumFile: loadLocalFile,
            changeToNetworkedFile: loadNetworkFile,
            setViewerStatus,
            clearSimulariumFile,
            setError,
        } = this.props;
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
                    <a href="https://allencell.org" title="Allen Cell Explorer">
                        {AicsLogo}
                    </a>
                    <span className={styles.verticalBar}>|</span>
                    <Link to="/" className={styles.simulariumHome}>
                        SIMULARIUM HOME
                    </Link>
                </div>
                <ViewerTitle
                    simulariumFileName={displayName}
                    lastModified={lastModified}
                />
                <div className={styles.buttons}>
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
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        simulariumFile: trajectoryStateBranch.selectors.getSimulariumFile(
            state
        ),
        isBuffering: viewerStateBranch.selectors.getIsBuffering(state),
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

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(AppHeader);
