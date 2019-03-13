import * as React from "react";
import { Layout } from "antd";

const { Header, Content } = Layout;

import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";

const styles = require("./style.css");

export default class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Layout tagName="main">
                <Header tagName="header">Header</Header>
                <Layout tagName="main">
                    <SideBar type="left">Sider</SideBar>
                    <Content tagName="main">Content</Content>
                    <SideBar type="right">
                        <ResultsPanel />
                    </SideBar>
                </Layout>
            </Layout>
        );
    }
}
