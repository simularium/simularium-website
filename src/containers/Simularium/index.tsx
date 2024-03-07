import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { Layout } from "antd";
import queryString from "query-string";
import { SimulariumController, ErrorLevel } from "@aics/simularium-viewer";
import { find } from "lodash";

import SideBar from "../../components/SideBar";
import ResultsPanel from "../ResultsPanel";
import ModelPanel from "../ModelPanel";
import ViewerPanel from "../ViewerPanel";
import { State } from "../../state/types";

import trajectoryStateBranch from "../../state/trajectory";
import selectionStateBranch from "../../state/selection";
import viewerStateBranch from "../../state/viewer";
import simulariumStateBranch from "../../state/simularium";
import {
    URL_PARAM_KEY_FILE_NAME,
    URL_PARAM_KEY_USER_URL,
} from "../../constants";
import {
    ClearSimFileDataAction,
    LoadViaUrlAction,
    LocalSimFile,
    RequestLocalFileAction,
    RequestNetworkFileAction,
    SetUrlParamsAction,
} from "../../state/trajectory/types";
import {
    SetErrorAction,
    SetViewerStatusAction,
} from "../../state/viewer/types";
import { SetSimulariumControllerAction } from "../../state/simularium/types";
import ViewerOverlayTarget from "../../components/ViewerOverlayTarget";
import {
    DragOverViewerAction,
    ResetDragOverViewerAction,
} from "../../state/viewer/types";
import { VIEWER_ERROR, VIEWER_LOADING } from "../../state/viewer/constants";
import TRAJECTORIES from "../../constants/networked-trajectories";
import { TrajectoryDisplayData } from "../../constants/interfaces";
import { clearBrowserUrlParams } from "../../util";
import {
    getFileIdFromUrl,
    urlCheck,
    getRedirectUrl,
} from "../../util/userUrlHandling";
const { Content } = Layout;

import styles from "./style.css";
import classNames from "classnames";
import { EMBED_PATHNAME } from "../../routes";
import EmbedOverlay from "../../components/EmbedOverlay";

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
    clearSimulariumFile: ActionCreator<ClearSimFileDataAction>;
    setError: ActionCreator<SetErrorAction>;
    setUrlParams: ActionCreator<SetUrlParamsAction>;
}

interface AppState {
    simulariumLoaded: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public simulariumController: SimulariumController | undefined;
    private interactiveContent = React.createRef<HTMLDivElement>();
    private endDragover = 0;
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
            setError,
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
                clearBrowserUrlParams();
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
                setError({
                    level: ErrorLevel.ERROR,
                    message: `${userTrajectoryUrl} does not seem like a url`,
                    htmlData:
                        "make sure to include 'http/https' at the beginning of the url, and check for typos",
                    onClose: clearBrowserUrlParams,
                });
                setViewerStatus({ status: VIEWER_ERROR });
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

    public renderOverlay(isEmbedded: boolean) {
        const {
            simulariumFile,
            resetDragOverViewer,
            changeToLocalSimulariumFile,
            viewerStatus,
            fileIsDraggedOverViewer,
            setViewerStatus,
            clearSimulariumFile,
            setError,
        } = this.props;
        if (isEmbedded) {
            return <EmbedOverlay title={simulariumFile.name} />;
        } else {
            return (
                <ViewerOverlayTarget
                    key="drop"
                    clearSimulariumFile={clearSimulariumFile}
                    loadLocalFile={changeToLocalSimulariumFile}
                    isLoading={viewerStatus === VIEWER_LOADING}
                    resetDragOverViewer={resetDragOverViewer}
                    fileIsDraggedOver={fileIsDraggedOverViewer}
                    setViewerStatus={setViewerStatus}
                    setError={setError}
                />
            );
        }
    }

    public render(): JSX.Element {
        const { simulariumController, changeToLocalSimulariumFile } =
            this.props;
        const isEmbedded = location.pathname === EMBED_PATHNAME;
        return (
            <Layout
                className={classNames([
                    styles.container,
                    { [styles.embed]: isEmbedded },
                ])}
            >
                <div ref={this.interactiveContent}>
                    <Layout className={styles.content}>
                        {this.renderOverlay(isEmbedded)}
                        <SideBar
                            onCollapse={this.onPanelCollapse}
                            isEmbedded={isEmbedded}
                            type="left"
                        >
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
                        <SideBar
                            onCollapse={this.onPanelCollapse}
                            isEmbedded={isEmbedded}
                            type="right"
                        >
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
        simulariumFile:
            trajectoryStateBranch.selectors.getSimulariumFile(state),
        simulariumController:
            simulariumStateBranch.selectors.getSimulariumController(state),
        fileIsDraggedOverViewer:
            viewerStateBranch.selectors.getFileDraggedOver(state),
        viewerStatus: viewerStateBranch.selectors.getStatus(state),
    };
}

const dispatchToPropsMap = {
    onSidePanelCollapse: selectionStateBranch.actions.onSidePanelCollapse,
    changeToLocalSimulariumFile:
        trajectoryStateBranch.actions.changeToLocalSimulariumFile,
    changeToNetworkedFile: trajectoryStateBranch.actions.changeToNetworkedFile,
    loadViaUrl: trajectoryStateBranch.actions.loadViaUrl,
    clearSimulariumFile: trajectoryStateBranch.actions.clearSimulariumFile,
    setSimulariumController:
        simulariumStateBranch.actions.setSimulariumController,
    resetDragOverViewer: viewerStateBranch.actions.resetDragOverViewer,
    dragOverViewer: viewerStateBranch.actions.dragOverViewer,
    setViewerStatus: viewerStateBranch.actions.setStatus,
    setError: viewerStateBranch.actions.setError,
};

export default connect(mapStateToProps, dispatchToPropsMap)(App);
