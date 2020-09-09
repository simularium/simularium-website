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
import {
    LocalSimFile,
    SetSimulariumControllerAction,
    ReceiveAction,
    SetViewerStatusAction,
} from "../../state/metadata/types";
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
    simulariumFile: LocalSimFile;
    setSimulariumController: ActionCreator<SetSimulariumControllerAction>;
    simulariumController: SimulariumController;
    changeLocalSimulariumFile: ActionCreator<ReceiveAction>;
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
        const { closeLoadFileModal, setSimulariumController } = this.props;
        const parsed = queryString.parse(location.search);
        const fileName = parsed[URL_PARAM_KEY_FILE_NAME];
        if (fileName && TRAJECTORY_FILES.includes(fileName as string)) {
            closeLoadFileModal();
            this.handleSelectNetworkFile(`${fileName}.h5`);
        }
        setSimulariumController(
            new SimulariumController({
                netConnectionSettings: netConnectionSettings,
            })
        );
    }

    public handleSelectNetworkFile(fileName: string) {
        const { simulariumController } = this.props;
        if (!this.simulariumController) {
            // initial load, user selects a file
            console.log("no controller");
        } else {
            // switching files
            simulariumController.changeFile(fileName);
        }
    }

    public handleLoadLocalFile(simulariumFile: LocalSimFile) {
        const { changeLocalSimulariumFile } = this.props;
        if (!simulariumFile.name || !simulariumFile.data) {
            return;
        }
        changeLocalSimulariumFile(simulariumFile);
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
            simulariumFile,
            simulariumController,
        } = this.props;
        return (
            <Layout className={styles.container}>
                <Header
                    modalOpen={modalOpen}
                    openLoadFileModal={openLoadFileModal}
                    loadLocalFile={this.handleLoadLocalFile}
                    simulariumFileName={simulariumFile.name}
                >
                    Header
                </Header>
                <Layout>
                    <SideBar onCollapse={this.onPanelCollapse} type="left">
                        <ModelPanel />
                    </SideBar>
                    <Content>
                        {simulariumController && (
                            <ViewerPanel
                                loadLocalFile={this.handleLoadLocalFile}
                                simulariumController={simulariumController}
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
        simulariumController: metadataStateBranch.selectors.getSimulariumController(
            state
        ),
    };
}

const dispatchToPropsMap = {
    onSidePanelCollapse: selectionStateBranch.actions.onSidePanelCollapse,
    openLoadFileModal: selectionStateBranch.actions.openLoadFileModal,
    closeLoadFileModal: selectionStateBranch.actions.closeLoadFileModal,
    changeLocalSimulariumFile:
        metadataStateBranch.actions.changeLocalSimulariumFile,
    setSimulariumController:
        metadataStateBranch.actions.setSimulariumController,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(App);
