import * as React from "react";
import { Link } from "react-router-dom";
import { Layout, Row } from "antd";

const { Footer: AntdFooter } = Layout;

const styles = require("./style.css");

const Footer: React.FunctionComponent<{}> = () => {
    return (
        <AntdFooter className={styles.container}>
            <Row className={styles.topRow} justify="space-around">
                <div>
                    <Link to="/">Simularium Home</Link>
                </div>
                <div>
                    <a href="https://www.allencell.org/terms-of-use.html">
                        Terms of Use
                    </a>
                </div>
                <div>
                    <a href="https://www.allencell.org/citation-policy.html">
                        Citation Policy
                    </a>
                </div>
                <div>
                    <a href="https://www.allencell.org/privacy-policy.html">
                        Privacy Policy
                    </a>
                </div>
                <div>
                    {/* TODO: Put in link to real forum when available */}
                    <a href="#">Forum</a>
                </div>
            </Row>
            <Row justify="space-around">
                <div>
                    Copyright © 2020 Allen Institute. All Rights Reserved.
                </div>
                <div>
                    <a href="https://www.allencell.org">allencell.org</a>
                </div>
            </Row>
        </AntdFooter>
    );
};

export default Footer;
