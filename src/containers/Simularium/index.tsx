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
import {
    URL_PARAM_KEY_FILE_NAME,
    URL_PARAM_KEY_USER_URL,
} from "../../constants";
import {
    LoadViaUrlAction,
    LocalSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
    SetSimulariumControllerAction,
    SetViewerStatusAction,
} from "../../state/metadata/types";
import ViewerOverlayTarget from "../../components/ViewerOverlayTarget";
import {
    DragOverViewerAction,
    ResetDragOverViewerAction,
} from "../../state/selection/types";
import { VIEWER_ERROR, VIEWER_LOADING } from "../../state/metadata/constants";
import TRAJECTORIES from "../../constants/networked-trajectories";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { clearUrlParams } from "../../util";
import {
    getFileIdFromUrl,
    urlCheck,
    getRedirectUrl,
} from "../../util/userUrlHandling";
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
    loadViaUrl: ActionCreator<LoadViaUrlAction>;
    setViewerStatus: ActionCreator<SetViewerStatusAction>;
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
            loadViaUrl,
            setViewerStatus,
        } = this.props;
        const current = this.interactiveContent.current;
        const controller = simulariumController || new SimulariumController({});

        const parsed = queryString.parse(location.search);
        const fileName = parsed[URL_PARAM_KEY_FILE_NAME];
        const userTrajectoryUrl = parsed[URL_PARAM_KEY_USER_URL];

        const loadNetworkedFile = (fileName: string | string[]) => {
            const networkedFile = find(TRAJECTORIES, { id: fileName });
            if (networkedFile) {
                const fileData = networkedFile as TrajectoryDisplayData;
                changeToNetworkedFile(
                    {
                        name: fileData.id,
                        title: fileData.title,
                    },
                    // simularium controller will get initialize in the change file logic
                    controller
                );
            } else {
                // if the name is not in our list of networked files, just quietly clear out the url
                // and save the controller
                clearUrlParams();
                setSimulariumController(controller);
            }
        };

        const loadUserTrajectoryUrl = (
            userTrajectoryUrl: string | string[]
        ) => {
            const verifiedUrl = urlCheck(userTrajectoryUrl);
            const fileId = getFileIdFromUrl(verifiedUrl, parsed.id);
            const redirectUrl = getRedirectUrl(verifiedUrl, fileId);

            if (redirectUrl) {
                // Edge case where we want to redirect to a networked file
                history.replaceState({}, "", redirectUrl);
                loadNetworkedFile(fileId as string);
            } else if (verifiedUrl) {
                loadViaUrl(verifiedUrl, controller, fileId);
            } else {
                // if the url doesn't pass the regEx check, notify the user and then clear the url
                // and save the controller
                setViewerStatus({
                    status: VIEWER_ERROR,
                    errorMessage: `${userTrajectoryUrl} does not seem like a url`,
                    htmlData:
                        "make sure to include 'http/https' at the beginning of the url, and check for typos",
                    onClose: clearUrlParams,
                });
                setSimulariumController(controller);
            }
        };

        if (fileName) {
            // URL has trajFileName param
            loadNetworkedFile(fileName);
        } else if (userTrajectoryUrl) {
            // URL has trajUrl param
            loadUserTrajectoryUrl(userTrajectoryUrl);
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
    loadViaUrl: metadataStateBranch.actions.loadViaUrl,
    setViewerStatus: metadataStateBranch.actions.setViewerStatus,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(App);
