import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";
import {
    ColorChange,
    SimulariumController,
    UIDisplayData,
} from "@aics/simularium-viewer";

import { State } from "../../state/types";
import { getSimulariumController } from "../../state/simularium/selectors";
import { getStatus } from "../../state/viewer/selectors";
import { ViewerStatus } from "../../state/viewer/types";
import {
    ReceiveAction,
    RequestNetworkFileAction,
} from "../../state/trajectory/types";
import {
    requestTrajectory,
    changeToNetworkedFile,
    receiveAgentNamesAndStates,
} from "../../state/trajectory/actions";
import {
    getUiDisplayDataTree,
    getIsNetworkedFile,
    getDefaultUISettingsApplied,
    getDefaultUIData,
    getSessionUIData,
} from "../../state/trajectory/selectors";
import {
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    AgentRenderingCheckboxMap,
    SetRecentColorsAction,
    ResetAction,
    StoreUIDataInBrowserAction,
} from "../../state/selection/types";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    clearSessionColorsFromStateAndBrowser,
    storeColorsInLocalStorage,
} from "../../state/selection/actions";
import {
    getAgentVisibilityMap,
    getAgentHighlightMap,
    getRecentColors,
} from "../../state/selection/selectors";

import CheckBoxTree, { AgentDisplayNode } from "../../components/AgentTree";
import SideBarContents from "../../components/SideBarContents";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import NavButton from "../../components/NavButton";
import { ButtonClass } from "../../constants/interfaces";

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
    receiveAgentNamesAndStates: ActionCreator<ReceiveAction>;
    payloadForSelectAll: AgentRenderingCheckboxMap;
    payloadForSelectNone: AgentRenderingCheckboxMap;
    isSharedCheckboxIndeterminate: boolean;
    viewerStatus: ViewerStatus;
    isNetworkedFile: boolean;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
    recentColors: string[];
    setRecentColors: ActionCreator<SetRecentColorsAction>;
    storeColorsInLocalStorage: ActionCreator<StoreUIDataInBrowserAction>;
    simulariumController: SimulariumController;
    clearSessionColorsFromStateAndBrowser: ActionCreator<ResetAction>;
    defaultUiSettingsApplied: boolean;
    defaultUIData: UIDisplayData;
    sessionUIData: UIDisplayData;
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
    simulariumController,
    clearSessionColorsFromStateAndBrowser,
    storeColorsInLocalStorage,
    defaultUiSettingsApplied,
    defaultUIData,
    sessionUIData,
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
            changeColor={(colorChange: ColorChange) =>
                simulariumController.applyColorChange(colorChange)
            }
            storeColorsInLocalStorage={storeColorsInLocalStorage}
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
                                    clearSessionColorsFromStateAndBrowser();
                                    simulariumController.applyColorSettings(
                                        defaultUIData
                                    );
                                }}
                                onMouseEnter={() =>
                                    simulariumController.applyColorSettings(
                                        defaultUIData
                                    )
                                }
                                onMouseLeave={() => {
                                    simulariumController.applyColorSettings(
                                        sessionUIData
                                    );
                                }}
                            />
                        )}
                    </div>,
                    null,
                ]}
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
        simulariumController: getSimulariumController(state),
        defaultUiSettingsApplied: getDefaultUISettingsApplied(state),
        defaultUIData: getDefaultUIData(state),
        sessionUIData: getSessionUIData(state),
    };
}

const dispatchToPropsMap = {
    requestTrajectory,
    changeToNetworkedFile,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
    setRecentColors,
    receiveAgentNamesAndStates,
    clearSessionColorsFromStateAndBrowser,
    storeColorsInLocalStorage,
};

export default connect(mapStateToProps, dispatchToPropsMap)(ModelPanel);
