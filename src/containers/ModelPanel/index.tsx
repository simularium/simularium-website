import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import { State } from "../../state/types";
import { ViewerStatus } from "../../state/viewer/types";
import { getStatus } from "../../state/viewer/selectors";
import { RequestNetworkFileAction } from "../../state/trajectory/types";
import {
    requestTrajectory,
    changeToNetworkedFile,
} from "../../state/trajectory/actions";
import {
    getUiDisplayDataTree,
    getIsNetworkedFile,
} from "../../state/trajectory/selectors";
import {
    AgentRenderingCheckboxMap,
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    SetRecentColorsAction,
    ApplyUserColorAction,
} from "../../state/selection/types";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    applyUserColor,
} from "../../state/selection/actions";
import {
    getAgentVisibilityMap,
    getAgentHighlightMap,
    getRecentColors,
    getSelectedAgentMetadata,
} from "../../state/selection/selectors";
import CheckBoxTree, { AgentDisplayNode } from "../../components/AgentTree";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";
import SideBarContents from "../../components/SideBarContents";
import { AgentMetadata } from "../../constants/interfaces";
import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";

import styles from "./style.css";

interface ModelPanelProps {
    uiDisplayDataTree: AgentDisplayNode[];
    agentHighlightMap: AgentRenderingCheckboxMap;
    agentVisibilityMap: AgentRenderingCheckboxMap;
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    payloadForSelectAll: AgentRenderingCheckboxMap;
    payloadForSelectNone: AgentRenderingCheckboxMap;
    isSharedCheckboxIndeterminate: boolean;
    viewerStatus: ViewerStatus;
    isNetworkedFile: boolean;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    recentColors: string[];
    applyUserColorSelection: ActionCreator<ApplyUserColorAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
    selectedAgentMetadata: AgentMetadata;
}

const ModelPanel: React.FC<ModelPanelProps> = ({
    uiDisplayDataTree,
    agentHighlightMap,
    agentVisibilityMap,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    payloadForSelectAll,
    payloadForSelectNone,
    isSharedCheckboxIndeterminate,
    viewerStatus,
    isNetworkedFile,
    changeToNetworkedFile: loadNetworkFile,
    recentColors,
    applyUserColorSelection,
    setRecentColors,
    selectedAgentMetadata,
}): JSX.Element => {
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
            applyUserColorSelection={applyUserColorSelection}
            setRecentColors={setRecentColors}
        />
    );
    const contentMap = {
        [ViewerStatus.Success]: checkboxTree,
        [ViewerStatus.Empty]: (
            <NoTrajectoriesText selectFile={loadNetworkFile} />
        ),
        [ViewerStatus.Loading]: <div />,
        [ViewerStatus.Error]: isNetworkedFile ? (
            <NetworkFileFailedText />
        ) : (
            <NoTypeMappingText />
        ),
    };

    return (
        <div className={styles.container}>
            <SideBarContents
                mainTitle="Agents"
                content={[contentMap[viewerStatus]]}
                selectedAgentMetadata={selectedAgentMetadata}
                uiDisplayData={uiDisplayDataTree}
            />
        </div>
    );
};

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
        selectedAgentMetadata: getSelectedAgentMetadata(state),
    };
}

const dispatchToPropsMap = {
    requestTrajectory,
    changeToNetworkedFile,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    applyUserColorSelection: applyUserColor,
    setRecentColors,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
