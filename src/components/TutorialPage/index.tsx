import * as React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const styles = require("./style.css");

const LandingPage = (): JSX.Element => (
    <Layout className={styles.container}>
        <Content className={styles.content}>Tutorial placeholder</Content>
    </Layout>
);

export default LandingPage;
