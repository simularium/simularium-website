import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import CollaspableMenu from "../../components/CollapseableMenu";
import { requestMetadata } from "../../state/metadata/actions";
import {
    getUiDisplayDataTreeVisibility,
    getUiDisplayDataTreeHighlight,
} from "../../state/metadata/selectors";
import { State } from "../../state/types";
import {
    getVisibleAgentsNamesAndTags,
    getHighlightedAgentsNamesAndTags,
} from "../../state/selection/selectors";
import {
    turnAgentsOnByDisplayKey,
    highlightAgentsByDisplayKey,
} from "../../state/selection/actions";
import { ChangeAgentsRenderingStateAction } from "../../state/selection/types";
import CheckBoxTree from "../../components/CheckBoxTree";
import { TreeNodeNormal } from "antd/lib/tree/Tree";
const styles = require("./style.css");

interface ModelPanelProps {
    visibilityDisplayOptions: TreeNodeNormal[];
    highlightedAgentKeys: string[];
    visibleAgentKeys: string[];
    highlightDisplayOptions: TreeNodeNormal[];
    turnAgentsOnByDisplayKey: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayKey: ActionCreator<
        ChangeAgentsRenderingStateAction
    >;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            visibleAgentKeys,
            visibilityDisplayOptions,
            turnAgentsOnByDisplayKey,
            highlightDisplayOptions,
            highlightAgentsByDisplayKey,
            highlightedAgentKeys,
        } = this.props;
        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Adjustable Parameters"
                subTitles={["Adjustable Parameter", "Statistics"]}
                content={[
                    <div className={styles.container} key="molecules">
                        <h3>Molecules</h3>
                        <CheckBoxTree
                            treeData={visibilityDisplayOptions}
                            handleCheck={turnAgentsOnByDisplayKey}
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
        visibilityDisplayOptions: getUiDisplayDataTreeVisibility(state),
        highlightDisplayOptions: getUiDisplayDataTreeHighlight(state),
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
