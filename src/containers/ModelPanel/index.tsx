import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import { ColorChange, SimulariumController } from "@aics/simularium-viewer";

import { State } from "../../state/types";
import { getSimulariumController } from "../../state/simularium/selectors";
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
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    clearUserSelectedColorsFromStateAndBrowser,
    storeColorsInLocalStorage,
} from "../../state/selection/actions";
import {
    getAgentVisibilityMap,
    getAgentHighlightMap,
    getRecentColors,
    getSelectedAgentMetadata,
} from "../../state/selection/selectors";

import CheckBoxTree, { AgentDisplayNode } from "../../components/AgentTree";
import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import { ViewerStatus } from "../../state/viewer/types";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";

import styles from "./style.css";
import NavButton from "../../components/NavButton";
import SideBarContents from "../../components/SideBarContents";
import { AgentMetadata, ButtonClass } from "../../constants/interfaces";
import {
    AgentRenderingCheckboxMap,
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    SetRecentColorsAction,
    StoreUIDataInBrowserAction,
    ResetAction,
} from "../../state/selection/types";

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
    storeColorsInLocalStorage: ActionCreator<StoreUIDataInBrowserAction>;
    simulariumController: SimulariumController;
    setCurrentColorSettings: ActionCreator<SetCurrentColorSettingsAction>;
    clearUserSelectedColorsFromStateAndBrowser: ActionCreator<ResetAction>;
    defaultUiSettingsApplied: boolean;
}

const ModelPanel: React.FC<ModelPanelProps> = ({
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
    setRecentColors,
    clearUserSelectedColorsFromStateAndBrowser,
    storeColorsInLocalStorage,
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
            setRecentColors={setRecentColors}
            changeColor={(colorChange: ColorChange) => {
                storeColorsInLocalStorage(colorChange);
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
                content={[
                    <div className={styles.container} key="molecules">
                        {contentMap[viewerStatus]}
                        {!defaultUiSettingsApplied && (
                            <NavButton
                                titleText={"Restore color defaults"}
                                buttonType={ButtonClass.Action}
                                clickHandler={() => {
                                    clearUserSelectedColorsFromStateAndBrowser();
                                    setCurrentColorSettings({
                                        currentColorSettings:
                                            ColorSettings.Default,
                                    });
                                }}
                                onMouseEnter={() => {
                                    setCurrentColorSettings({
                                        currentColorSettings:
                                            ColorSettings.Default,
                                    });
                                }}
                                onMouseLeave={() => {
                                    setCurrentColorSettings({
                                        currentColorSettings:
                                            ColorSettings.UserSelected,
                                    });
                                }}
                            />
                        )}
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
        simulariumController: getSimulariumController(state),
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
    clearUserSelectedColorsFromStateAndBrowser,
    storeColorsInLocalStorage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
