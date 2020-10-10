import * as React from "react";
import { Layout, Row, Col } from "antd";

const { Footer: AntdFooter } = Layout;

const styles = require("./style.css");

const Footer: React.FunctionComponent<{}> = () => {
    return (
        <AntdFooter className={styles.container}>
            <Row>
                <Col>Simularium Home</Col>
                <Col>Terms of Use</Col>
                <Col>Citation Policy</Col>
                <Col>Privacy Policy</Col>
                <Col>Forum</Col>
            </Row>
            <Row>
                <Col>
                    Copyright © 2020 Allen Institute. All Rights Reserved.
                </Col>
                <Col>allencell.org</Col>
            </Row>
        </AntdFooter>
    );
};

export default Footer;
