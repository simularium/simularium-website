import * as React from "react";
import { NavLink } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { PageHeader, Tag } from "antd";
import moment from "moment";

import { LocalSimFile, RequestFileAction } from "../../state/metadata/types";
import LoadFileMenu from "../../components/LoadFileMenu";
import HeaderTitle from "../../components/HeaderTitle";
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
                title={<HeaderTitle simulariumFileName={simulariumFileName} />}
                className={styles.pageHeader}
                onBack={() => null}
                backIcon={<a href="https://allencell.org">{AicsLogo}</a>}
                tags={
                    lastModified ? (
                        <Tag className={styles.tag}>
                            {moment(lastModified).format()}
                        </Tag>
                    ) : (
                        []
                    )
                }
                extra={[
                    <span key="home" className={styles.home}>
                        <NavLink to="/">SIMULARIUM HOME</NavLink>
                    </span>,
                    <LoadFileMenu
                        key="select"
                        selectFile={loadNetworkFile}
                        loadLocalFile={loadLocalFile}
                    />,
                ]}
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
