import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Layout } from "antd";
import queryString from "query-string";
import { SimulariumController } from "@aics/simularium-viewer";

import LoadTrajectoryFileModal from "../../components/LoadTrajectoryFileModal";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import ViewerPanel from "../ViewerPanel";
import { ToggleAction } from "../../state/selection/types";
import { State } from "../../state/types";

import selectionStateBranch from "../../state/selection";
import { TRAJECTORY_FILES, URL_PARAM_KEY_FILE_NAME } from "../../constants";
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

interface AppState {
    simulariumLoaded: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public simulariumController: SimulariumController | undefined;
    constructor(props: AppProps) {
        super(props);
        this.onPanelCollapse = this.onPanelCollapse.bind(this);
        this.handleSelectFile = this.handleSelectFile.bind(this);
    }

    componentDidMount() {
        const { closeLoadFileModal } = this.props;
        const parsed = queryString.parse(location.search);
        const fileName = parsed[URL_PARAM_KEY_FILE_NAME];
        if (fileName && TRAJECTORY_FILES.includes(fileName as string)) {
            closeLoadFileModal();
            this.handleSelectFile(`${fileName}.h5`);
        }
    }

    public handleSelectFile(fileName: string) {
        if (!this.simulariumController) {
            // initial load, user selects a file
            this.simulariumController = new SimulariumController({
                trajectoryPlaybackFile: fileName,
                netConnectionSettings: netConnectionSettings,
            });
            this.setState({ simulariumLoaded: true });
        } else {
            // switching files
            this.simulariumController.changeFile(fileName);
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
            <Layout className={styles.container}>
                <Header
                    modalOpen={modalOpen}
                    openLoadFileModal={openLoadFileModal}
                >
                    Header
                </Header>
                <Layout>
                    <SideBar onCollapse={this.onPanelCollapse} type="left">
                        <ModelPanel />
                    </SideBar>
                    <Content>
                        {this.simulariumController && (
                            <ViewerPanel
                                simulariumController={this.simulariumController}
                            />
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
