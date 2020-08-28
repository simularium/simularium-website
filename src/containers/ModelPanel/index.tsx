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
    turnAgentsOnByDisplayName,
    highlightAgentsByDisplayName,
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
    turnAgentsOnByDisplayName: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayName: ActionCreator<
        ChangeAgentsRenderingStateAction
    >;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            visibleAgentKeys,
            visibilityDisplayOptions,
            turnAgentsOnByDisplayName,
            highlightDisplayOptions,
            highlightAgentsByDisplayName,
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
                            handleCheck={turnAgentsOnByDisplayName}
                            agentsChecked={visibleAgentKeys}
                            title="Turn on/off"
                        />
                        <CheckBoxTree
                            treeData={highlightDisplayOptions}
                            handleCheck={highlightAgentsByDisplayName}
                            agentsChecked={highlightedAgentKeys}
                            title="Highlight"
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
    turnAgentsOnByDisplayName,
    highlightAgentsByDisplayName,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
