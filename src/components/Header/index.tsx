import * as React from "react";
import { Layout, Row, Col } from "antd";

const { Header, Content } = Layout;

import SideBar from "../../components/SideBar";

const styles = require("./style.css");

export default class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Header tagName="header">
                <div>3D Cell Spatial Simulator</div>
                <Row>
                    <Col />
                    <Col />
                    <Col />
                    <Col />
                </Row>
            </Header>
        );
    }
}
