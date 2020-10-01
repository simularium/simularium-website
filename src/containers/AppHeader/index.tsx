import * as React from "react";
import { NavLink } from "react-router-dom";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Layout, PageHeader, Tag, Button } from "antd";
import moment from "moment";

import { LocalSimFile, RequestFileAction } from "../../state/metadata/types";
import LoadFileMenu from "../../components/LoadFileMenu";
import { GoBack } from "../../components/Icons";
import { State } from "../../state/types";
import metadataStateBranch from "../../state/metadata";

const { Header } = Layout;

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
            <Header className={styles.container}>
                <PageHeader
                    title={simulariumFileName ? simulariumFileName : ""}
                    className={styles.pageHeader}
                    onBack={() => null}
                    backIcon={<NavLink to="/">{GoBack} Home</NavLink>}
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
                        <LoadFileMenu
                            key="select"
                            selectFile={loadNetworkFile}
                            loadLocalFile={loadLocalFile}
                        />,
                    ]}
                    footer={
                        <Button type="ghost" href="tutorial">
                            Getting Started
                        </Button>
                    }
                />
            </Header>
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
