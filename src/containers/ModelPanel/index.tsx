import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import CollaspableMenu from "../../components/CollapseableMenu";
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
} from "../../state/selection/actions";
import {
    ChangeAgentsRenderingStateAction,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import CheckBoxTree, { AgentDisplayNode } from "../../components/CheckBoxTree";

const styles = require("./style.css");

interface ModelPanelProps {
    uiDisplayDataTree: AgentDisplayNode[];
    highlightedAgentKeys: VisibilitySelectionMap;
    visibleAgentKeys: VisibilitySelectionMap;
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayKey: ActionCreator<
        ChangeAgentsRenderingStateAction
    >;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            visibleAgentKeys,
            uiDisplayDataTree,
            turnAgentsOnByDisplayKey,
            highlightAgentsByDisplayKey,
            highlightedAgentKeys,
        } = this.props;
        console.log(visibleAgentKeys);
        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Adjustable Parameters"
                subTitles={["Adjustable Parameter", "Statistics"]}
                content={[
                    <div className={styles.container} key="molecules">
                        <CheckBoxTree
                            treeData={uiDisplayDataTree}
                            handleAgentCheck={turnAgentsOnByDisplayKey}
                            agentsChecked={visibleAgentKeys}
                            handleHighlight={highlightAgentsByDisplayKey}
                            agentsHighlighted={highlightedAgentKeys}
                            title="Turn on/off"
                        />
                    </div>,
                    null,
                ]}
            />
        );
    }
}

function mapStateToProps(state: State) {
    return {
        visibleAgentKeys: getVisibleAgentsNamesAndTags(state),
        highlightedAgentKeys: getHighlightedAgentsNamesAndTags(state),
        uiDisplayDataTree: getUiDisplayDataTree(state),
    };
}

const dispatchToPropsMap = {
    requestMetadata,
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
