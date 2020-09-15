import * as React from "react";
import { Layout, Row, Col, PageHeader, Tag, Button } from "antd";
import { ActionCreator } from "redux";
import moment from "moment";

import FileUpload from "../FileUpload";
import { LocalSimFile, RequestFileAction } from "../../state/metadata/types";
import NetworkFileMenu from "../NetworkFileMenu";
import { Link, NavLink } from "react-router-dom";
const { Header } = Layout;

const styles = require("./style.css");

interface AppHeaderProps {
    loadLocalFile: (simFile: LocalSimFile) => void;
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
                    backIcon={<NavLink to="/">Simularium</NavLink>}
                    tags={
                        lastModified ? (
                            <Tag>{moment(lastModified).format()}</Tag>
                        ) : (
                            []
                        )
                    }
                    extra={[
                        <NetworkFileMenu
                            key="select"
                            selectFile={loadNetworkFile}
                        />,
                        <FileUpload
                            key="upload"
                            loadLocalFile={loadLocalFile}
                        />,
                        ,
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
