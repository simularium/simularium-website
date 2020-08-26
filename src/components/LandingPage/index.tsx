import * as React from "react";
import { Layout, Card, Avatar } from "antd";
import { TRAJECTORY_FILES, URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Meta } = Card;

const styles = require("./style.css");

class LandingPage extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
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
        );
    }
}

export default LandingPage;
