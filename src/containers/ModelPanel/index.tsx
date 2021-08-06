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
    getAgentColors,
} from "../../state/selection/selectors";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
} from "../../state/selection/actions";
import {
    AgentColorMap,
    ChangeAgentsRenderingStateAction,
    SetVisibleAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import CheckBoxTree, { AgentDisplayNode } from "../../components/CheckBoxTree";
import {
    convertUITreeDataToSelectAll,
    convertUITreeDataToSelectNone,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";
import {
    VIEWER_EMPTY,
    VIEWER_ERROR,
    VIEWER_LOADING,
    VIEWER_SUCCESS,
} from "../../state/viewer/constants";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import NoTypeMappingText from "../../components/NoTrajectoriesText/NoTypeMappingText";
import { RequestNetworkFileAction } from "../../state/trajectory/types";
import { ViewerStatus } from "../../state/viewer/types";
import NetworkFileFailedText from "../../components/NoTrajectoriesText/NetworkFileFailedText";

const styles = require("./style.css");

interface ModelPanelProps {
    uiDisplayDataTree: AgentDisplayNode[];
    agentHighlightMap: VisibilitySelectionMap;
    agentVisibilityMap: VisibilitySelectionMap;
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayKey: ActionCreator<
        ChangeAgentsRenderingStateAction
    >;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    payloadForSelectAll: VisibilitySelectionMap;
    payloadForSelectNone: VisibilitySelectionMap;
    isSharedCheckboxIndeterminate: boolean;
    agentColors: AgentColorMap;
    viewerStatus: ViewerStatus;
    isNetworkedFile: boolean;
    changeToNetworkedFile: ActionCreator<RequestNetworkFileAction>;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
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
            agentColors,
            viewerStatus,
            isNetworkedFile,
            changeToNetworkedFile: loadNetworkFile,
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
                agentColors={agentColors}
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
        payloadForSelectAll: convertUITreeDataToSelectAll(state),
        payloadForSelectNone: convertUITreeDataToSelectNone(state),
        isSharedCheckboxIndeterminate: getIsSharedCheckboxIndeterminate(state),
        agentColors: getAgentColors(state),
        viewerStatus: getStatus(state),
        isNetworkedFile: getIsNetworkedFile(state),
    };
}

const dispatchToPropsMap = {
    requestTrajectory,
    changeToNetworkedFile,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
