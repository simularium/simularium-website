import * as React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Button } from "antd";

const { Footer: AntdFooter } = Layout;

import styles from "./style.css";

const Footer = (): JSX.Element => {
    return (
        <AntdFooter className={styles.container}>
            <Row justify="space-around">
                <div className={styles.linkColumn}>
                    <Link to="/">Simularium Home</Link>
                </div>
                <div className={styles.linkColumn}>
                    <a href="https://www.allencell.org/terms-of-use.html">
                        Terms of Use
                    </a>
                </div>
                <div className={styles.linkColumn}>
                    <a href="https://www.allencell.org/citation-policy.html">
                        Citation Policy
                    </a>
                </div>
                <div className={styles.linkColumn}>
                    <a href="https://www.allencell.org/privacy-policy.html">
                        Privacy Policy
                    </a>
                </div>
                <div className={styles.linkColumn}>
                    <a href="https://forum.allencell.org/c/software-code/simularium/">
                        Forum
                    </a>
                </div>
            </Row>
            <Row justify="space-around">
                {/* OneTrust Cookies Settings button start */}
                <Button
                    type="link"
                    id="ot-sdk-btn"
                    className="ot-sdk-show-settings"
                >
                    Cookie Settings
                </Button>
                {/* OneTrust Cookies Settings button end */}
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
