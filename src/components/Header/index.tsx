import * as React from "react";
import { Layout, Row, Col, Button, PageHeader, Tag } from "antd";
import { ActionCreator } from "redux";
import moment from "moment";

import FileUpload from "../FileUpload";
import { LocalSimFile, RequestFileAction } from "../../state/metadata/types";
import NetworkFileMenu from "../NetworkFileMenu";
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
                    title="Simularium"
                    subTitle={simulariumFileName ? simulariumFileName : ""}
                    tags={
                        lastModified ? (
                            <Tag color="blue">
                                {moment(lastModified).format()}
                            </Tag>
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
                />
                <Row>
                    <Col />
                    <Col />
                    <Col />
                </Row>
            </Header>
        );
    }
}
