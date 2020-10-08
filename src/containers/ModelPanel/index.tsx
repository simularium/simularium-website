import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import SideBarContents from "../../components/SideBarContents";
import { requestMetadata } from "../../state/metadata/actions";
import { getUiDisplayDataTree } from "../../state/metadata/selectors";
import { State } from "../../state/types";
import {
    getVisibleAgentsNamesAndTags,
    getHighlightedAgentsNamesAndTags,
} from "../../state/selection/selectors";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
    setAgentsVisible,
} from "../../state/selection/actions";
import {
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
        } = this.props;
        return (
            <div className={styles.container}>
                <SideBarContents
                    mainTitle="Agents"
                    content={[
                        <div className={styles.container} key="molecules">
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
                            />
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
