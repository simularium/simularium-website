import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Layout } from "antd";
import { AgentSimController } from "agentviz-viewer";

import LoadTrajectoryFileModal from "../../components/LoadTrajectoryFileModal";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import ViewerPanel from "../ViewerPanel";
import { ToggleAction } from "../../state/selection/types";
import { State } from "../../state/types";

import selectionStateBranch from "../../state/selection";
const { Content } = Layout;

const styles = require("./style.css");

const netConnectionSettings = {
    serverIp: process.env.BACKEND_SERVER_IP,
    serverPort: 9002,
};

interface AppProps {
    onSidePanelCollapse: (number: number) => void;
    openLoadFileModal: ActionCreator<ToggleAction>;
    modalOpen: boolean;
    closeLoadFileModal: ActionCreator<ToggleAction>;
}

class App extends React.Component<AppProps, {}> {
    public agentSim: AgentSimController | undefined;
    constructor(props: AppProps) {
        super(props);
        this.onPanelCollapse = this.onPanelCollapse.bind(this);
        this.handleSelectFile = this.handleSelectFile.bind(this);
    }

    public handleSelectFile(fileName: string) {
        if (!this.agentSim) {
            // initial load, user selects a file
            this.agentSim = new AgentSimController(netConnectionSettings, {
                trajectoryPlaybackFile: fileName,
            });
        } else {
            // switching files
            this.agentSim.changeFile(fileName);
        }
    }

    public onPanelCollapse(open: boolean) {
        const { onSidePanelCollapse } = this.props;
        const value = open ? 1 : -1;
        onSidePanelCollapse(value);
    }

    public render(): JSX.Element {
        const { openLoadFileModal, modalOpen, closeLoadFileModal } = this.props;
        return (
            <Layout tagName="main" className={styles.container}>
                <Header
                    modalOpen={modalOpen}
                    openLoadFileModal={openLoadFileModal}
                >
                    Header
                </Header>
                <Layout tagName="main">
                    <SideBar onCollapse={this.onPanelCollapse} type="left">
                        <ModelPanel />
                    </SideBar>
                    <Content tagName="main">
                        {this.agentSim && (
                            <ViewerPanel agentSim={this.agentSim} />
                        )}
                    </Content>
                    <SideBar onCollapse={this.onPanelCollapse} type="right">
                        <ResultsPanel />
                    </SideBar>
                </Layout>
                <LoadTrajectoryFileModal
                    visible={modalOpen}
                    selectFile={this.handleSelectFile}
                    closeModal={closeLoadFileModal}
                />
            </Layout>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        modalOpen: selectionStateBranch.selectors.modalOpen(state),
    };
}

const dispatchToPropsMap = {
    onSidePanelCollapse: selectionStateBranch.actions.onSidePanelCollapse,
    openLoadFileModal: selectionStateBranch.actions.openLoadFileModal,
    closeLoadFileModal: selectionStateBranch.actions.closeLoadFileModal,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(App);
