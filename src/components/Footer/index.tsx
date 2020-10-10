import * as React from "react";
import { Layout, Row, Col } from "antd";

const { Footer: AntdFooter } = Layout;

const styles = require("./style.css");

const Footer: React.FunctionComponent<{}> = () => {
    return (
        <AntdFooter className={styles.container}>
            <Row className={styles.topRow} justify="space-around">
                <div>Simularium Home</div>
                <div>Terms of Use</div>
                <div>Citation Policy</div>
                <div>Privacy Policy</div>
                <div>Forum</div>
            </Row>
            <Row justify="space-around">
                <div>
                    Copyright © 2020 Allen Institute. All Rights Reserved.
                </div>
                <div>allencell.org</div>
            </Row>
        </AntdFooter>
    );
};

export default Footer;
