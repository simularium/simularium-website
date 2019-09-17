import * as React from "react";
import CollaspableMenu from "../../components/CollapseableMenu";
import { connect } from "react-redux";
import { requestMetadata } from "../../state/metadata/actions";
import { getMetadata, getAgentIds } from "../../state/metadata/selectors";
import { State } from "../../state/types";

class ModelPanel extends React.Component<{}, {}> {
    public render(): JSX.Element {
        console.log(this.props.agentIds);
        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Adjustable Parameters"
                subTitles={["Adjustable Parameter", "Statistics"]}
                content={[null, null]}
            />
        );
    }
}

function mapStateToProps(state: State) {
    return {
        agentIds: getAgentIds(state),
    };
}

const dispatchToPropsMap = {
    requestMetadata,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ModelPanel);
