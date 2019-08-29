import * as React from "react";
import { Layout } from "antd";

import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import CenterPanel from "../CenterPanel";

const { Header, Content } = Layout;

const styles = require("./style.css");

export default class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Layout tagName="main" className={styles.container}>
                <Header tagName="header">Header</Header>
                <Layout tagName="main">
                    <SideBar type="left">
                        <ModelPanel />
                    </SideBar>
                    <Content tagName="main">
                        <CenterPanel />
                    </Content>
                    <SideBar type="right">
                        <ResultsPanel />
                    </SideBar>
                </Layout>
            </Layout>
        );
    }
}
