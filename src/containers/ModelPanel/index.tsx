import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import CollaspableMenu from "../../components/CollapseableMenu";
import { requestMetadata } from "../../state/metadata/actions";
import {
    getAgentIds,
    getUiDisplayDataTree,
} from "../../state/metadata/selectors";
import { State } from "../../state/types";
import CheckBoxes from "../../components/CheckBoxes";
import {
    getHightlightedId,
    getAgentsOnById,
    getAgentsOnByName,
} from "../../state/selection/selectors";
import {
    turnAgentsOnById,
    highlightAgent,
    turnAgentsOnByDisplayName,
} from "../../state/selection/actions";
import {
    TurnAgentsOnAction,
    HighlightAgentAction,
} from "../../state/selection/types";
import RadioButtons from "../../components/RadioButtons";
import CheckBoxTree from "../../components/CheckBoxTree";
const styles = require("./style.css");

interface ModelPanelProps {
    agentIds: string[];
    agentDisplayData: any;
    turnAgentsOnById: ActionCreator<TurnAgentsOnAction>;
    highlightedAgent: string;
    highlightAgent: ActionCreator<HighlightAgentAction>;
    visibleAgentNames: string[];
    turnAgentsOnByDisplayName: ActionCreator<TurnAgentsOnAction>;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            agentIds,
            visibleAgentNames,
            agentDisplayData,
            turnAgentsOnById,
            turnAgentsOnByDisplayName,
            highlightedAgent,
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
                            turnAgentsOnByDisplayName={
                                turnAgentsOnByDisplayName
                            }
                            agentsOn={visibleAgentNames}
                        />
                        {/* <CheckBoxes
                            options={agentIds}
                            values={agentsOn}
                            onChange={turnAgentsOnById}
                            key="checkbox-group"
                            title="Turn on/off"
                        /> */}
                        <RadioButtons
                            value={highlightedAgent}
                            options={agentIds}
                            onChange={highlightAgent}
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
        agentIds: getAgentIds(state),
        visibleAgentNames: getAgentsOnByName(state),
        highlightedAgent: getHightlightedId(state),
        agentDisplayData: getUiDisplayDataTree(state),
    };
}

const dispatchToPropsMap = {
    requestMetadata,
    turnAgentsOnById,
    turnAgentsOnByDisplayName,
    highlightAgent,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
