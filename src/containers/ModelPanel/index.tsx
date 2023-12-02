import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import SideBarContents from "../../components/SideBarContents";
import {
    requestTrajectory,
    changeToNetworkedFile,
} from "../../state/trajectory/actions";
import {
    getUiDisplayDataTree,
    getIsNetworkedFile,
} from "../../state/trajectory/selectors";
import { getStatus } from "../../state/viewer/selectors";
import { State } from "../../state/types";
import {
    getAgentVisibilityMap,
    getAgentHighlightMap,
    getRecentColors,
} from "../../state/selection/selectors";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setColorChange,
    setRecentColors,
} from "../../state/selection/actions";
import {
    ChangeAgentsRenderingStateAction,
    SetColorChangeAction,
    SetVisibleAction,
    VisibilitySelectionMap,
    SetRecentColorsAction,
} from "../../state/selection/types";
import CheckBoxTree, { AgentDisplayNode } from "../../components/CheckBoxTree";
import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";
import {
    VIEWER_EMPTY,
    VIEWER_ERROR,
    VIEWER_LOADING,
    VIEWER_SUCCESS,
} from "../../state/viewer/constants";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import { RequestNetworkFileAction } from "../../state/trajectory/types";
import { ViewerStatus } from "../../state/viewer/types";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";

import styles from "./style.css";

interface ModelPanelProps {
    uiDisplayDataTree: AgentDisplayNode[];
    agentHighlightMap: VisibilitySelectionMap;
    agentVisibilityMap: VisibilitySelectionMap;
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    payloadForSelectAll: VisibilitySelectionMap;
    payloadForSelectNone: VisibilitySelectionMap;
    isSharedCheckboxIndeterminate: boolean;
    viewerStatus: ViewerStatus;
    isNetworkedFile: boolean;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    recentColors: string[];
    setColorChange: ActionCreator<SetColorChangeAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
}

class ModelPanel extends React.Component<ModelPanelProps> {
    public render(): JSX.Element {
        const {
            agentVisibilityMap,
            uiDisplayDataTree,
            turnAgentsOnByDisplayKey,
            highlightAgentsByDisplayKey,
            agentHighlightMap,
            setAgentsVisible,
            payloadForSelectAll,
            payloadForSelectNone,
            isSharedCheckboxIndeterminate,
            viewerStatus,
            isNetworkedFile,
            changeToNetworkedFile: loadNetworkFile,
            recentColors,
            setColorChange,
            setRecentColors,
        } = this.props;
        const checkboxTree = (
            <CheckBoxTree
                treeData={uiDisplayDataTree}
                handleAgentCheck={turnAgentsOnByDisplayKey}
                agentsChecked={agentVisibilityMap}
                handleHighlight={highlightAgentsByDisplayKey}
                agentsHighlighted={agentHighlightMap}
                setAgentsVisible={setAgentsVisible}
                payloadForSelectAll={payloadForSelectAll}
                payloadForSelectNone={payloadForSelectNone}
                isSharedCheckboxIndeterminate={isSharedCheckboxIndeterminate}
                recentColors={recentColors}
                setColorChange={setColorChange}
                setRecentColors={setRecentColors}
            />
        );
        const contentMap = {
            [VIEWER_SUCCESS]: checkboxTree,
            [VIEWER_EMPTY]: <NoTrajectoriesText selectFile={loadNetworkFile} />,
            [VIEWER_LOADING]: <div />,
            [VIEWER_ERROR]: isNetworkedFile ? (
                <NetworkFileFailedText />
            ) : (
                <NoTypeMappingText />
            ),
        };

        return (
            <div className={styles.container}>
                <SideBarContents
                    mainTitle="Agents"
                    content={[
                        <div className={styles.container} key="molecules">
                            {contentMap[viewerStatus]}
                        </div>,
                        null,
                    ]}
                />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        agentVisibilityMap: getAgentVisibilityMap(state),
        agentHighlightMap: getAgentHighlightMap(state),
        uiDisplayDataTree: getUiDisplayDataTree(state),
        payloadForSelectAll: getSelectAllVisibilityMap(state),
        payloadForSelectNone: getSelectNoneVisibilityMap(state),
        isSharedCheckboxIndeterminate: getIsSharedCheckboxIndeterminate(state),
        viewerStatus: getStatus(state),
        isNetworkedFile: getIsNetworkedFile(state),
        recentColors: getRecentColors(state),
    };
}

const dispatchToPropsMap = {
    requestTrajectory,
    changeToNetworkedFile,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setColorChange,
    setRecentColors,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
