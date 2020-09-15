import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Layout } from "antd";
import queryString from "query-string";
import { SimulariumController } from "@aics/simularium-viewer";

import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import ViewerPanel from "../ViewerPanel";
import { State } from "../../state/types";

import metadataStateBranch from "../../state/metadata";
import selectionStateBranch from "../../state/selection";
import { TRAJECTORY_FILES, URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    LocalSimFile,
    SetSimulariumControllerAction,
    RequestFileAction,
} from "../../state/metadata/types";
const { Content } = Layout;

const styles = require("./style.css");

const netConnectionSettings = {
    serverIp: process.env.BACKEND_SERVER_IP,
    serverPort: 9002,
};

interface AppProps {
    onSidePanelCollapse: (number: number) => void;
    simulariumFile: LocalSimFile;
    setSimulariumController: ActionCreator<SetSimulariumControllerAction>;
    simulariumController: SimulariumController;
    changeToLocalSimulariumFile: ActionCreator<RequestFileAction>;
    changeToNetworkedFile: ActionCreator<RequestFileAction>;
}

interface AppState {
    simulariumLoaded: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public simulariumController: SimulariumController | undefined;
    constructor(props: AppProps) {
        super(props);
        this.onPanelCollapse = this.onPanelCollapse.bind(this);
    }

    componentDidMount() {
        const { setSimulariumController, changeToNetworkedFile } = this.props;
        const parsed = queryString.parse(location.search);
        const fileName = parsed[URL_PARAM_KEY_FILE_NAME];
        if (fileName && TRAJECTORY_FILES.includes(fileName as string)) {
            changeToNetworkedFile({
                name: `${fileName}`,
                data: null,
                dateModified: null,
            });
        }
        setSimulariumController(
            new SimulariumController({
                netConnectionSettings: netConnectionSettings,
            })
        );
    }

    public onPanelCollapse(open: boolean) {
        const { onSidePanelCollapse } = this.props;
        const value = open ? 1 : -1;
        onSidePanelCollapse(value);
    }

    public render(): JSX.Element {
        const {
            simulariumFile,
            simulariumController,
            changeToLocalSimulariumFile,
            changeToNetworkedFile,
        } = this.props;
        return (
            <Layout className={styles.container}>
                <Header
                    loadLocalFile={changeToLocalSimulariumFile}
                    simulariumFileName={simulariumFile.name}
                    lastModified={simulariumFile.lastModified}
                    loadNetworkFile={changeToNetworkedFile}
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
                                loadLocalFile={changeToLocalSimulariumFile}
                                simulariumController={simulariumController}
                            />
                        )}
                    </Content>
                    <SideBar onCollapse={this.onPanelCollapse} type="right">
                        <ResultsPanel />
                    </SideBar>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        simulariumFile: metadataStateBranch.selectors.getSimulariumFile(state),
        simulariumController: metadataStateBranch.selectors.getSimulariumController(
            state
        ),
    };
}

const dispatchToPropsMap = {
    onSidePanelCollapse: selectionStateBranch.actions.onSidePanelCollapse,
    changeToLocalSimulariumFile:
        metadataStateBranch.actions.changeToLocalSimulariumFile,
    setSimulariumController:
        metadataStateBranch.actions.setSimulariumController,
    changeToNetworkedFile: metadataStateBranch.actions.changeToNetworkedFile,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(App);
