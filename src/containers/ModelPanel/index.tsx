import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import SideBarContents from "../../components/SideBarContents";
import { requestMetadata } from "../../state/metadata/actions";
import {
    getUiDisplayDataTree,
    getViewerStatus,
} from "../../state/metadata/selectors";
import { State } from "../../state/types";
import {
    getVisibleAgentsNamesAndTags,
    getHighlightedAgentsNamesAndTags,
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
    getCheckboxAllIsIntermediate,
} from "./selectors";
import {
    VIEWER_EMPTY,
    VIEWER_ERROR,
    VIEWER_LOADING,
    VIEWER_SUCCESS,
} from "../../state/metadata/constants";
import NoTrajectoriesText from "../../components/NoTrajectoriesText";
import { isEmpty } from "lodash";
import NoTypeMappingText from "../../components/NoTypeMappingText";
import { VIEWER_STATUS } from "../../state/metadata/types";

const styles = require("./style.css");

interface ModelPanelProps {
    uiDisplayDataTree: AgentDisplayNode[];
    highlightedAgentKeys: VisibilitySelectionMap;
    visibleAgentKeys: VisibilitySelectionMap;
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayKey: ActionCreator<
        ChangeAgentsRenderingStateAction
    >;
    setAgentsVisible: ActionCreator<SetVisibleAction>;
    payloadForSelectAll: VisibilitySelectionMap;
    payloadForSelectNone: VisibilitySelectionMap;
    checkAllIsIntermediate: boolean;
    agentColors: AgentColorMap;
    viewerStatus: VIEWER_STATUS;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            visibleAgentKeys,
            uiDisplayDataTree,
            turnAgentsOnByDisplayKey,
            highlightAgentsByDisplayKey,
            highlightedAgentKeys,
            setAgentsVisible,
            payloadForSelectAll,
            payloadForSelectNone,
            checkAllIsIntermediate,
            agentColors,
            viewerStatus,
        } = this.props;
        const checkboxTree = (
            <CheckBoxTree
                treeData={uiDisplayDataTree}
                handleAgentCheck={turnAgentsOnByDisplayKey}
                agentsChecked={visibleAgentKeys}
                handleHighlight={highlightAgentsByDisplayKey}
                agentsHighlighted={highlightedAgentKeys}
                setAgentsVisible={setAgentsVisible}
                payloadForSelectAll={payloadForSelectAll}
                payloadForSelectNone={payloadForSelectNone}
                checkAllIsIntermediate={checkAllIsIntermediate}
                agentColors={agentColors}
            />
        );
        const contentMap = {
            [VIEWER_SUCCESS]: checkboxTree,
            [VIEWER_EMPTY]: <NoTrajectoriesText />,
            // needed to include these for typescript
            [VIEWER_LOADING]: undefined,
            [VIEWER_ERROR]: undefined,
        };
        let content: JSX.Element | undefined = contentMap[viewerStatus];
        if (!content && isEmpty(uiDisplayDataTree)) {
            content = <NoTypeMappingText />;
        } else if (!isEmpty(uiDisplayDataTree)) {
            content = checkboxTree;
        }
        return (
            <div className={styles.container}>
                <SideBarContents
                    mainTitle="Agents"
                    content={[
                        <div className={styles.container} key="molecules">
                            {content}
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
        visibleAgentKeys: getVisibleAgentsNamesAndTags(state),
        highlightedAgentKeys: getHighlightedAgentsNamesAndTags(state),
        uiDisplayDataTree: getUiDisplayDataTree(state),
        payloadForSelectAll: convertUITreeDataToSelectAll(state),
        payloadForSelectNone: convertUITreeDataToSelectNone(state),
        checkAllIsIntermediate: getCheckboxAllIsIntermediate(state),
        agentColors: getAgentColors(state),
        viewerStatus: getViewerStatus(state),
    };
}

const dispatchToPropsMap = {
    requestMetadata,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
