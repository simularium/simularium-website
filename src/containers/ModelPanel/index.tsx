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
    getSelectedAgentMetadata,
} from "../../state/selection/selectors";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setColorChange,
    setRecentColors,
    storeColorsInState,
} from "../../state/selection/actions";
import {
    ChangeAgentsRenderingStateAction,
    SetColorChangeAction,
    SetVisibleAction,
    AgentRenderingCheckboxMap,
    SetRecentColorsAction,
    StoreColorsInStateAction,
} from "../../state/selection/types";
import CheckBoxTree, { AgentDisplayNode } from "../../components/AgentTree";
import { AgentMetadata } from "../../constants/interfaces";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import { RequestNetworkFileAction } from "../../state/trajectory/types";
import { ViewerStatus } from "../../state/viewer/types";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";
import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";

import styles from "./style.css";
import { ColorChange } from "@aics/simularium-viewer";

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
    setColorChange: ActionCreator<SetColorChangeAction>;
    setRecentColors: ActionCreator<SetRecentColorsAction>;
    selectedAgentMetadata: AgentMetadata;
    storeColorsInState: ActionCreator<StoreColorsInStateAction>;
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
    setRecentColors,
    selectedAgentMetadata,
    storeColorsInState,
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
            setRecentColors={setRecentColors}
            changeColor={(colorChange: ColorChange) => {
                storeColorsInState(colorChange);
            }}
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
    setColorChange,
    setRecentColors,
    storeColorsInState,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
