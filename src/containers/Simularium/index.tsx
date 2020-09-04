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

import metadataStateBranch from "../../state/metadata";
import selectionStateBranch from "../../state/selection";
import { TRAJECTORY_FILES, URL_PARAM_KEY_FILE_NAME } from "../../constants";
import { MetadataStateBranch, LocalSimFile } from "../../state/metadata/types";
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
    saveLocalSimulariumFile: ActionCreator<MetadataStateBranch>;
    simulariumFile: LocalSimFile;
}

interface AppState {
    simulariumLoaded: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public simulariumController: SimulariumController | undefined;
    constructor(props: AppProps) {
        super(props);
        this.onPanelCollapse = this.onPanelCollapse.bind(this);
        this.handleSelectNetworkFile = this.handleSelectNetworkFile.bind(this);
        this.handleLoadLocalFile = this.handleLoadLocalFile.bind(this);
    }

    componentDidMount() {
        const { closeLoadFileModal } = this.props;
        const parsed = queryString.parse(location.search);
        const fileName = parsed[URL_PARAM_KEY_FILE_NAME];
        if (fileName && TRAJECTORY_FILES.includes(fileName as string)) {
            closeLoadFileModal();
            this.handleSelectNetworkFile(`${fileName}.h5`);
        }
    }

    public handleSelectNetworkFile(fileName: string) {
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

    public handleLoadLocalFile() {
        const { simulariumFile } = this.props;
        console.log("GOT FILEDATA", simulariumFile);
        if (!simulariumFile.name || !simulariumFile.data) {
            return;
        }
        if (!this.simulariumController) {
            console.log("make new controller");
            // initial load, user selects a file
            this.simulariumController = new SimulariumController({
                netConnectionSettings: netConnectionSettings,
            });
            this.simulariumController.changeFile(
                simulariumFile.name,
                true,
                simulariumFile.data
            );

            this.setState({ simulariumLoaded: true });
        } else {
            // switching files
            this.simulariumController.changeFile(
                simulariumFile.name,
                true,
                simulariumFile.data
            );
        }
    }

    public onPanelCollapse(open: boolean) {
        const { onSidePanelCollapse } = this.props;
        const value = open ? 1 : -1;
        onSidePanelCollapse(value);
    }

    public render(): JSX.Element {
        const {
            openLoadFileModal,
            modalOpen,
            closeLoadFileModal,
            saveLocalSimulariumFile,
            simulariumFile,
        } = this.props;
        return (
            <Layout className={styles.container}>
                <Header
                    modalOpen={modalOpen}
                    openLoadFileModal={openLoadFileModal}
                    loadLocalFile={this.handleLoadLocalFile}
                    saveLocalSimulariumFile={saveLocalSimulariumFile}
                    simulariumFileName={simulariumFile.name}
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
                    selectFile={this.handleSelectNetworkFile}
                    closeModal={closeLoadFileModal}
                />
            </Layout>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        modalOpen: selectionStateBranch.selectors.modalOpen(state),
        simulariumFile: metadataStateBranch.selectors.getSimulariumFile(state),
    };
}

const dispatchToPropsMap = {
    onSidePanelCollapse: selectionStateBranch.actions.onSidePanelCollapse,
    openLoadFileModal: selectionStateBranch.actions.openLoadFileModal,
    closeLoadFileModal: selectionStateBranch.actions.closeLoadFileModal,
    saveLocalSimulariumFile: metadataStateBranch.actions.receiveSimulariumFile,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(App);
