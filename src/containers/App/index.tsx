import * as React from "react";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

import SideBar from "../../components/SideBar";

const styles = require("./style.css");

export default class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Layout>
                <Header>Header</Header>
                <Layout>
                    <SideBar type="left">Sider</SideBar>
                    <Content>Content</Content>
                    <SideBar type="right">Sider</SideBar>
                </Layout>
            </Layout>
        );
    }
}
