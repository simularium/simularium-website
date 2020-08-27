import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import CollaspableMenu from "../../components/CollapseableMenu";
import { requestMetadata } from "../../state/metadata/actions";
import {
    getAgentIds,
    getUiDisplayDataTree,
    getUiDisplayDataTreeHighlight,
} from "../../state/metadata/selectors";
import { State } from "../../state/types";
import CheckBoxes from "../../components/CheckBoxes";
import {
    getHightlightedId,
    getAgentsOnById,
    getVisibleAgentsNamesAndTags,
    getHighlightedAgentsNamesAndTags,
} from "../../state/selection/selectors";
import {
    turnAgentsOnById,
    highlightAgent,
    turnAgentsOnByDisplayName,
    highlightAgentsByDisplayName,
} from "../../state/selection/actions";
import {
    ChangeAgentsRenderingStateAction,
    HighlightAgentAction,
} from "../../state/selection/types";
import RadioButtons from "../../components/RadioButtons";
import CheckBoxTree from "../../components/CheckBoxTree";
const styles = require("./style.css");

interface ModelPanelProps {
    agentIds: string[];
    agentDisplayData: any;
    turnAgentsOnById: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgent: ActionCreator<HighlightAgentAction>;
    highlightedAgents: string[];
    visibleAgentNames: string[];
    agentHighlightDisplayData: any;
    turnAgentsOnByDisplayName: ActionCreator<ChangeAgentsRenderingStateAction>;
    highlightAgentsByDisplayName: ActionCreator<
        ChangeAgentsRenderingStateAction
    >;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            agentIds,
            visibleAgentNames,
            agentDisplayData,
            turnAgentsOnById,
            turnAgentsOnByDisplayName,
            agentHighlightDisplayData,
            highlightAgentsByDisplayName,
            highlightedAgents,
            highlightAgent,
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
                            treeData={agentDisplayData}
                            handleCheck={turnAgentsOnByDisplayName}
                            agentsChecked={visibleAgentNames}
                            title="Turn on/off"
                        />
                        <CheckBoxTree
                            treeData={agentHighlightDisplayData}
                            handleCheck={highlightAgentsByDisplayName}
                            agentsChecked={highlightedAgents}
                            title="Highlight"
                        />
                        {/* <CheckBoxes
                            options={agentIds}
                            values={agentsOn}
                            onChange={turnAgentsOnById}
                            key="checkbox-group"
                            title="Turn on/off"
                        /> */}
                        {/* <RadioButtons
                            value={highlightedAgent}
                            options={agentIds}
                            onChange={highlightAgent}
                            title="Highlight"
                        /> */}
                    </div>,
                    null,
                ]}
            />
        );
    }
}

function mapStateToProps(state: State) {
    return {
        agentIds: getAgentIds(state),
        visibleAgentNames: getVisibleAgentsNamesAndTags(state),
        highlightedAgents: getHighlightedAgentsNamesAndTags(state),
        agentDisplayData: getUiDisplayDataTree(state),
        agentHighlightDisplayData: getUiDisplayDataTreeHighlight(state),
    };
}

const dispatchToPropsMap = {
    requestMetadata,
    turnAgentsOnById,
    turnAgentsOnByDisplayName,
    highlightAgent,
    highlightAgentsByDisplayName,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
