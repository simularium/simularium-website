import * as React from "react";
import { Layout, Row, Col, Button } from "antd";
import { ActionCreator } from "redux";

import { ToggleAction } from "../../state/selection/types";
const { Header } = Layout;

const styles = require("./style.css");

interface AppHeaderProps {
    openLoadFileModal: ActionCreator<ToggleAction>;
    modalOpen: boolean;
}
export default class AppHeader extends React.Component<AppHeaderProps, {}> {
    public render(): JSX.Element {
        const { openLoadFileModal } = this.props;
        return (
            <Header tagName="header" className={styles.container}>
                <div>3D Cell Spatial Simulator</div>
                <Row>
                    <Col>
                        <Button type="primary" onClick={openLoadFileModal}>
                            Load
                        </Button>
                    </Col>
                    <Col />
                    <Col />
                    <Col />
                </Row>
            </Header>
        );
    }
}
