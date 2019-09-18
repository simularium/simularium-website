import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import CollaspableMenu from "../../components/CollapseableMenu";
import { requestMetadata } from "../../state/metadata/actions";
import { getMetadata, getAgentIds } from "../../state/metadata/selectors";
import { State } from "../../state/types";
import CheckBoxes from "../../components/CheckBoxes";
import { getAgentsOn } from "../../state/selection/selectors";
import { turnAgentsOn } from "../../state/selection/actions";
import { TurnAgentsOnAction } from "../../state/selection/types";

interface ModelPanelProps {
    agentIds: string[];
    agentsOn: string[];
    turnAgentsOn: ActionCreator<TurnAgentsOnAction>;
}

class ModelPanel extends React.Component<ModelPanelProps, {}> {
    public render(): JSX.Element {
        const { agentIds, agentsOn, turnAgentsOn } = this.props;

        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Adjustable Parameters"
                subTitles={["Adjustable Parameter", "Statistics"]}
                content={[
                    <CheckBoxes
                        options={agentIds}
                        values={agentsOn}
                        onChange={turnAgentsOn}
                        key="checkbox-group"
                    />,
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
    };
}

const dispatchToPropsMap = {
    requestMetadata,
    turnAgentsOn,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
