import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Layout } from "antd";
import queryString from "query-string";
import { SimulariumController } from "@aics/simularium-viewer";
import { find } from "lodash";

import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import ViewerPanel from "../ViewerPanel";
import { State } from "../../state/types";

import metadataStateBranch from "../../state/metadata";
import selectionStateBranch from "../../state/selection";
import { URL_PARAM_KEY_FILE_NAME } from "../../constants";
import {
    LocalSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
    SetSimulariumControllerAction,
} from "../../state/metadata/types";
import ViewerOverlayTarget from "../../components/ViewerOverlayTarget";
import {
    DragOverViewerAction,
    ResetDragOverViewerAction,
} from "../../state/selection/types";
import { VIEWER_LOADING } from "../../state/metadata/constants";
import TRAJECTORIES from "../../constants/networked-trajectories";
import { TrajectoryDisplayData } from "../../constants/interfaces";
const { Content } = Layout;

const styles = require("./style.css");

interface AppProps {
    onSidePanelCollapse: (number: number) => void;
    simulariumFile: LocalSimFile;
    setSimulariumController: ActionCreator<SetSimulariumControllerAction>;
    simulariumController: SimulariumController;
    changeToLocalSimulariumFile: ActionCreator<RequestLocalFileAction>;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    fileIsDraggedOverViewer: boolean;
    dragOverViewer: ActionCreator<DragOverViewerAction>;
    resetDragOverViewer: ActionCreator<ResetDragOverViewerAction>;
    viewerStatus: string;
}

interface AppState {
    simulariumLoaded: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public simulariumController: SimulariumController | undefined;
    private interactiveContent = React.createRef<HTMLDivElement>();
    private endDragover: number = 0;
    constructor(props: AppProps) {
        super(props);
        this.onPanelCollapse = this.onPanelCollapse.bind(this);
        this.handleDragOverViewer = this.handleDragOverViewer.bind(this);
        this.handleEndDrag = this.handleEndDrag.bind(this);
    }

    componentDidMount() {
        const {
            setSimulariumController,
            changeToNetworkedFile,
            simulariumController,
        } = this.props;
        const current = this.interactiveContent.current;

        const parsed = queryString.parse(location.search);
        const fileName = parsed[URL_PARAM_KEY_FILE_NAME];
        const file = find(TRAJECTORIES, { id: fileName });
        const controller = simulariumController || new SimulariumController({});
        if (fileName && file) {
            const fileData = file as TrajectoryDisplayData;
            // simularium controller will get initialize in the change file logic
            changeToNetworkedFile(
                {
                    name: fileData.id,
                    title: fileData.title,
                },
                controller
            );
        } else {
            setSimulariumController(controller);
        }
        if (current) {
            current.addEventListener(
                "dragover",
                this.handleDragOverViewer,
                false
            );
            current.addEventListener("dragleave", this.handleEndDrag, false);
        }
    }

    public onPanelCollapse(open: boolean) {
        const { onSidePanelCollapse } = this.props;
        const value = open ? 1 : -1;
        onSidePanelCollapse(value);
    }

    public handleDragOverViewer(event: DragEvent) {
        const { dragOverViewer, fileIsDraggedOverViewer } = this.props;
        event.preventDefault();
        clearTimeout(this.endDragover);
        if (!fileIsDraggedOverViewer) {
            dragOverViewer();
        }
    }

    public handleEndDrag() {
        const { resetDragOverViewer, fileIsDraggedOverViewer } = this.props;
        if (fileIsDraggedOverViewer) {
            // holding the mouse still registers as a "dragleave"
            // setting timeout to keep the overlay from flickering
            this.endDragover = window.setTimeout(() => {
                resetDragOverViewer();
            }, 300);
        }
    }

    public render(): JSX.Element {
        const {
            simulariumController,
            changeToLocalSimulariumFile,
            resetDragOverViewer,
            viewerStatus,
            fileIsDraggedOverViewer,
        } = this.props;
        return (
            <Layout className={styles.container}>
                <div ref={this.interactiveContent}>
                    <Layout className={styles.content}>
                        <ViewerOverlayTarget
                            key="drop"
                            loadLocalFile={changeToLocalSimulariumFile}
                            isLoading={viewerStatus === VIEWER_LOADING}
                            resetDragOverViewer={resetDragOverViewer}
                            fileIsDraggedOverViewer={fileIsDraggedOverViewer}
                        />
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
                </div>
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
        fileIsDraggedOverViewer: selectionStateBranch.selectors.getFileDraggedOverViewer(
            state
        ),
        viewerStatus: metadataStateBranch.selectors.getViewerStatus(state),
    };
}

const dispatchToPropsMap = {
    onSidePanelCollapse: selectionStateBranch.actions.onSidePanelCollapse,
    changeToLocalSimulariumFile:
        metadataStateBranch.actions.changeToLocalSimulariumFile,
    setSimulariumController:
        metadataStateBranch.actions.setSimulariumController,
    changeToNetworkedFile: metadataStateBranch.actions.changeToNetworkedFile,
    resetDragOverViewer: selectionStateBranch.actions.resetDragOverViewer,
    dragOverViewer: selectionStateBranch.actions.dragOverViewer,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(App);
