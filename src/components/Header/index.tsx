import * as React from "react";
import { Layout, Row, Col, Button, PageHeader, Tag } from "antd";
import { ActionCreator } from "redux";
import moment from "moment";

import { ToggleAction } from "../../state/selection/types";
import FileUpload from "../FileUpload";
import { LocalSimFile } from "../../state/metadata/types";
const { Header } = Layout;

const styles = require("./style.css");

interface AppHeaderProps {
    openLoadFileModal: ActionCreator<ToggleAction>;
    modalOpen: boolean;
    loadLocalFile: (simFile: LocalSimFile) => void;
    simulariumFileName: string;
    lastModified: number;
}
export default class AppHeader extends React.Component<AppHeaderProps, {}> {
    public render(): JSX.Element {
        const {
            openLoadFileModal,
            loadLocalFile,
            simulariumFileName,
            lastModified,
        } = this.props;
        return (
            <Header className={styles.container}>
                <PageHeader
                    title="Simularium"
                    subTitle={
                        simulariumFileName
                            ? simulariumFileName.split("@")[0]
                            : ""
                    } // removing appended date stamp
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
                        <Button
                            key="open"
                            type="primary"
                            onClick={openLoadFileModal}
                        >
                            Load Existing Simulation
                        </Button>,
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
