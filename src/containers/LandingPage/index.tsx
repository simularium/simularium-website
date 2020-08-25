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
                        {TRAJECTORY_FILES.map((file) => {
                            return (
                                <Link
                                    key={file}
                                    to={{
                                        pathname: "/viewer",
                                        search: `?${URL_PARAM_KEY_FILE_NAME}=${file}`,
                                    }}
                                >
                                    <Card
                                        style={{
                                            width: 300,
                                        }}
                                        cover={
                                            <img
                                                alt="example"
                                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                            />
                                        }
                                        actions={[
                                            <Icon key="setting" />,
                                            <Icon key="edit" />,
                                            <Icon key="ellipsis" />,
                                        ]}
                                    >
                                        <Meta
                                            avatar={
                                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                            }
                                            title={file}
                                            description="This is the description"
                                        />
                                    </Card>
                                </Link>
                            );
                        })}
                    </Content>
                </Layout>
                <Footer />
            </Layout>
        );
    }
}

export default LandingPage;
