import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import { State } from "../../state/types";
import { ViewerStatus } from "../../state/viewer/types";
import { getStatus } from "../../state/viewer/selectors";
import {
    RequestNetworkFileAction,
    ColorSettings,
    SetCurrentColorSettingsAction,
} from "../../state/trajectory/types";
import {
    requestTrajectory,
    changeToNetworkedFile,
    setCurrentColorSettings,
} from "../../state/trajectory/actions";
import {
    getUiDisplayDataTree,
    getIsNetworkedFile,
    getDefaultUISettingsApplied,
} from "../../state/trajectory/selectors";
import {
    AgentRenderingCheckboxMap,
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    SetRecentColorsAction,
    ApplyUserColorSelectionAction,
    ResetAction,
} from "../../state/selection/types";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    clearUserSelectedColors,
    applyUserColorSelection,
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
import NavButton from "../../components/NavButton";
import SideBarContents from "../../components/SideBarContents";
import { AgentMetadata, ButtonClass } from "../../constants/interfaces";
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
    setRecentColors: ActionCreator<SetRecentColorsAction>;
    selectedAgentMetadata: AgentMetadata;
    applyUserColorSelection: ActionCreator<ApplyUserColorSelectionAction>;
    setCurrentColorSettings: ActionCreator<SetCurrentColorSettingsAction>;
    clearUserSelectedColors: ActionCreator<ResetAction>;
    defaultUiSettingsApplied: boolean;
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
    clearUserSelectedColors,
    applyUserColorSelection,
    defaultUiSettingsApplied,
    setCurrentColorSettings,
    selectedAgentMetadata,
}) => {
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

    const handleRestorDefaultClick = () => {
        clearUserSelectedColors();
        setCurrentColorSettings({
            currentColorSettings: ColorSettings.Default,
        });
    };

    const handleRestoreDefaultMouseEnter = () => {
        if (!defaultUiSettingsApplied) {
            setCurrentColorSettings({
                currentColorSettings: ColorSettings.Default,
            });
        }
    };

    const handleRestoreDefaultMouseLeave = () => {
        if (!defaultUiSettingsApplied) {
            setCurrentColorSettings({
                currentColorSettings: ColorSettings.UserSelected,
            });
        }
    };

    return (
        <div className={styles.container}>
            <SideBarContents
                mainTitle="Agents"
                content={[
                    <div className={styles.container} key="molecules">
                        {contentMap[viewerStatus]}
                        <NavButton
                            titleText={"Restore color defaults"}
                            buttonType={ButtonClass.Action}
                            isDisabled={defaultUiSettingsApplied}
                            clickHandler={handleRestorDefaultClick}
                            onMouseEnter={handleRestoreDefaultMouseEnter}
                            onMouseLeave={handleRestoreDefaultMouseLeave}
                        />
                    </div>,
                    null,
                ]}
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
        defaultUiSettingsApplied: getDefaultUISettingsApplied(state),
    };
}

const dispatchToPropsMap = {
    requestTrajectory,
    changeToNetworkedFile,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    setCurrentColorSettings,
    clearUserSelectedColors,
    applyUserColorSelection,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
