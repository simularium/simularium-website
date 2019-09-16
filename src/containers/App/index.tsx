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
    onSidePanelCollapse: (number: number) => void;
}
class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
        this.onPanelCollapse = this.onPanelCollapse.bind(this);
    }
    public onPanelCollapse(open: boolean) {
        const { onSidePanelCollapse } = this.props;
        const value = open ? 1 : -1;
        onSidePanelCollapse(value);
    }

    public render(): JSX.Element {
        return (
            <Layout tagName="main" className={styles.container}>
                <Header>Header</Header>
                <Layout tagName="main">
                    <SideBar onCollapse={this.onPanelCollapse} type="left">
                        <ModelPanel />
                    </SideBar>
                    <Content tagName="main">
                        <CenterPanel />
                    </Content>
                    <SideBar onCollapse={this.onPanelCollapse} type="right">
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
