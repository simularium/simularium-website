import * as React from "react";
import { Layout, Card, Icon, Avatar } from "antd";
import { TRAJECTORY_FILES, URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { Link } from "react-router-dom";

const { Content, Header, Footer } = Layout;
const { Meta } = Card;

const styles = require("./style.css");

class LandingPage extends React.Component<{}, {}> {
    selectTrajectory() {}
    public render(): JSX.Element {
        return (
            <Layout className={styles.container}>
                <Header>Simularium</Header>
                <Layout>
                    <Content className={styles.content}>
                        Tutorial placeholder
                    </Content>
                </Layout>
                <Footer />
            </Layout>
        );
    }
}

export default LandingPage;
