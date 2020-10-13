import * as React from "react";
import { NavLink } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { PageHeader } from "antd";

import { LocalSimFile, RequestFileAction } from "../../state/metadata/types";
import LoadFileMenu from "../../components/LoadFileMenu";
import HeaderExtra from "../../components/HeaderExtra";
import { AicsLogo } from "../../components/Icons";
import { State } from "../../state/types";
import metadataStateBranch from "../../state/metadata";

const styles = require("./style.css");

interface AppHeaderProps {
    simulariumFile: LocalSimFile;
    changeToLocalSimulariumFile: ActionCreator<RequestFileAction>;
    changeToNetworkedFile: ActionCreator<RequestFileAction>;
}

class AppHeader extends React.Component<AppHeaderProps, {}> {
    public render(): JSX.Element {
        const {
            simulariumFile,
            changeToLocalSimulariumFile: loadLocalFile,
            changeToNetworkedFile: loadNetworkFile,
        } = this.props;
        const { name: simulariumFileName, lastModified } = simulariumFile;

        return (
            <PageHeader
                title={
                    <div>
                        <span key="home" className={styles.home}>
                            <NavLink to="/">SIMULARIUM HOME</NavLink>
                        </span>
                        <LoadFileMenu
                            key="select"
                            selectFile={loadNetworkFile}
                            loadLocalFile={loadLocalFile}
                        />
                    </div>
                }
                className={styles.pageHeader}
                onBack={() => null}
                backIcon={<a href="https://allencell.org">{AicsLogo}</a>}
                extra={
                    <HeaderExtra
                        simulariumFileName={simulariumFileName}
                        lastModified={lastModified}
                    />
                }
                footer={<NavLink to="/tutorial">GETTING STARTED</NavLink>}
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
