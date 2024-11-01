import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { UIDisplayData } from "@aics/simularium-viewer";

import { State } from "../../state/types";
import { ViewerStatus } from "../../state/viewer/types";
import { getStatus } from "../../state/viewer/selectors";
import { RequestNetworkFileAction } from "../../state/trajectory/types";
import {
    requestTrajectory,
    changeToNetworkedFile,
} from "../../state/trajectory/actions";
import { getIsNetworkedFile } from "../../state/trajectory/selectors";
import {
    AgentRenderingCheckboxMap,
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    SetRecentColorsAction,
    ColorSettings,
    SetCurrentColorSettingsAction,
    SetSelectedUIDisplayDataAction,
} from "../../state/selection/types";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    setSelectedUIDisplayData,
    setCurrentColorSettings,
    storeDisplayDataInBrowser,
} from "../../state/selection/actions";
import {
    getAgentVisibilityMap,
    getAgentHighlightMap,
    getRecentColors,
    getSelectedAgentMetadata,
} from "../../state/selection/selectors";
import { getCurrentUIData } from "../../state/compoundSelectors";
import CheckBoxTree, { AgentDisplayNode } from "../../components/AgentTree";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";
import SideBarContents from "../../components/SideBarContents";
import { AgentMetadata, ColorChange } from "../../constants/interfaces";
import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
    getUiDisplayDataTree,
} from "./selectors";

import styles from "./style.css";
import { applyColorChangeToUiDisplayData } from "../../util";

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
    setRecentColors: ActionCreator<SetRecentColorsAction>;
    selectedAgentMetadata: AgentMetadata;
    currentUIDisplayData: UIDisplayData;
    setCurrentColorSettings: ActionCreator<SetCurrentColorSettingsAction>;
    setSelectedUIDisplayData: ActionCreator<SetSelectedUIDisplayDataAction>;
    storeDisplayDataInBrowser: ActionCreator<SetSelectedUIDisplayDataAction>;
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
    setSelectedUIDisplayData,
    setCurrentColorSettings,
    storeDisplayDataInBrowser,
    currentUIDisplayData,
}): JSX.Element => {
    const updateSelectedUiDisplayData = (colorChange: ColorChange) => {
        const newUIData = applyColorChangeToUiDisplayData(
            colorChange,
            currentUIDisplayData
        );
        setSelectedUIDisplayData(newUIData);
        setCurrentColorSettings({
            currentColorSettings: ColorSettings.UserSelected,
        });
        storeDisplayDataInBrowser(newUIData);
    };

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
            applyUserColor={updateSelectedUiDisplayData}
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
        currentUIDisplayData: getCurrentUIData(state),
    };
}

const dispatchToPropsMap = {
    requestTrajectory,
    changeToNetworkedFile,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    setSelectedUIDisplayData,
    setCurrentColorSettings,
    storeDisplayDataInBrowser,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
