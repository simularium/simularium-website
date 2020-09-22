import * as React from "react";
import { Layout, PageHeader, Tag, Button } from "antd";
import { ActionCreator } from "redux";
import moment from "moment";

import { RequestFileAction } from "../../state/metadata/types";
import LoadFileMenu from "../LoadFileMenu";
import { NavLink } from "react-router-dom";
import { GoBack } from "../Icons";

const { Header } = Layout;

const styles = require("./style.css");

interface AppHeaderProps {
    loadLocalFile: ActionCreator<RequestFileAction>;
    simulariumFileName: string;
    lastModified: number;
    loadNetworkFile: ActionCreator<RequestFileAction>;
}
export default class AppHeader extends React.Component<AppHeaderProps, {}> {
    public render(): JSX.Element {
        const {
            loadNetworkFile,
            loadLocalFile,
            simulariumFileName,
            lastModified,
        } = this.props;
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
