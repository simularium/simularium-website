import * as React from "react";
import { Layout } from "antd";

import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import CenterPanel from "../CenterPanel";
import { connect } from "react-redux";
import { onSidePanelCollapse } from "../../state/selection/actions";

const { Content } = Layout;

const styles = require("./style.css");

interface AppProps {
    onSidePanelCollapse: () => void;
}
class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        const { onSidePanelCollapse } = this.props;

        const onPanelCollapse = (open) => {
            const value = open ? 1 : -1;
            onSidePanelCollapse(value);
        };
        return (
            <Layout tagName="main" className={styles.container}>
                <Header>Header</Header>
                <Layout tagName="main">
                    <SideBar onCollapse={onPanelCollapse} type="left">
                        <ModelPanel />
                    </SideBar>
                    <Content tagName="main">
                        <CenterPanel />
                    </Content>
                    <SideBar onCollapse={onPanelCollapse} type="right">
                        <ResultsPanel />
                    </SideBar>
                </Layout>
            </Layout>
        );
    }
}

const dispatchToPropsMap = {
    onSidePanelCollapse,
};

export default connect(
    null,
    dispatchToPropsMap
)(App);
