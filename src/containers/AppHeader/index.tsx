import * as React from "react";
import { NavLink } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { PageHeader } from "antd";

import {
    LocalSimFile,
    NetworkedSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
} from "../../state/metadata/types";
import LoadFileMenu from "../../components/LoadFileMenu";
import HeaderExtra from "../../components/HeaderExtra";
import SupportMenu from "../../components/SupportMenu";
import { AicsLogo } from "../../components/Icons";
import { State } from "../../state/types";
import metadataStateBranch from "../../state/metadata";

const styles = require("./style.css");

interface AppHeaderProps {
    simulariumFile: LocalSimFile | NetworkedSimFile;
    changeToLocalSimulariumFile: ActionCreator<RequestLocalFileAction>;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
}

class AppHeader extends React.Component<AppHeaderProps, {}> {
    public render(): JSX.Element {
        const {
            simulariumFile,
            changeToLocalSimulariumFile: loadLocalFile,
            changeToNetworkedFile: loadNetworkFile,
        } = this.props;
        let lastModified = 0;
        let displayName = "";
        const isLocalSimFile = (file: any): file is LocalSimFile =>
            !!file.lastModified;
        const isNetworkedFile = (file: any): file is NetworkedSimFile =>
            !!file.title;

        if (isLocalSimFile(simulariumFile)) {
            displayName = simulariumFile.name;
            lastModified = simulariumFile.lastModified;
        } else if (isNetworkedFile(simulariumFile)) {
            displayName = simulariumFile.title;
        }

        return (
            <PageHeader
                className={styles.pageHeader}
                backIcon={<a href="https://allencell.org">{AicsLogo}</a>}
                onBack={() => null}
                title={
                    <div key="home" className={styles.home}>
                        <NavLink to="/">Simularium home</NavLink>
                    </div>
                }
                subTitle={
                    <HeaderExtra
                        simulariumFileName={displayName}
                        lastModified={lastModified}
                    />
                }
                extra={[
                    <LoadFileMenu
                        key="select"
                        selectFile={loadNetworkFile}
                        loadLocalFile={loadLocalFile}
                    />,
                    <SupportMenu key="support" />,
                ]}
            />
        );
    }
}

function mapStateToProps(state: State) {
    return {
        simulariumFile: metadataStateBranch.selectors.getSimulariumFile(state),
    };
}

const dispatchToPropsMap = {
    changeToLocalSimulariumFile:
        metadataStateBranch.actions.changeToLocalSimulariumFile,
    changeToNetworkedFile: metadataStateBranch.actions.changeToNetworkedFile,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(AppHeader);
