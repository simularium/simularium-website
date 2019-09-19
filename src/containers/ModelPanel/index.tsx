import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import CollaspableMenu from "../../components/CollapseableMenu";
import { requestMetadata } from "../../state/metadata/actions";
import { getMetadata, getAgentIds } from "../../state/metadata/selectors";
import { State } from "../../state/types";
import CheckBoxes from "../../components/CheckBoxes";
import {
    getAgentsOn,
    getHightlightedId,
} from "../../state/selection/selectors";
import { turnAgentsOn, highlightAgent } from "../../state/selection/actions";
import {
    TurnAgentsOnAction,
    HighlightAgentAction,
} from "../../state/selection/types";
import RadioButtons from "../../components/RadioButtons";

const styles = require("./style.css");

interface ModelPanelProps {
    agentIds: string[];
    agentsOn: string[];
    turnAgentsOn: ActionCreator<TurnAgentsOnAction>;
    highlightedAgent: string;
    highlightAgent: ActionCreator<HighlightAgentAction>;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const {
            agentIds,
            agentsOn,
            turnAgentsOn,
            highlightedAgent,
            highlightAgent,
        } = this.props;

        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Adjustable Parameters"
                subTitles={["Adjustable Parameter", "Statistics"]}
                content={[
                    <div className={styles.container}>
                        <h3>Molecules</h3>
                        <CheckBoxes
                            options={agentIds}
                            values={agentsOn}
                            onChange={turnAgentsOn}
                            key="checkbox-group"
                            title="Turn on/off"
                        />
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
        agentsOn: getAgentsOn(state),
        highlightedAgent: getHightlightedId(state),
    };
}

const dispatchToPropsMap = {
    requestMetadata,
    turnAgentsOn,
    highlightAgent,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
