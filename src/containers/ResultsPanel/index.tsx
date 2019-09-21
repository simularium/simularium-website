import * as React from "react";
import { ActionCreator } from "redux";
import CollaspableMenu from "../../components/CollapseableMenu";

import Graphing from "../../components/Graphing";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import { ChangeTimeAction } from "../../state/selection/types";
import { requestMetadata } from "../../state/metadata/actions";
import { RequestAction } from "../../state/metadata/types";
import { getGraphData } from "../../state/metadata/selectors";

interface ResultsPanelProps {
    graphData: any;
    requestMetadata: ActionCreator<RequestAction>;
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
    public componentDidMount() {
        const { requestMetadata } = this.props;
        requestMetadata();
    }
    public render(): JSX.Element {
        const { changeTime, time, graphData } = this.props;
        return (
            <CollaspableMenu
                panelKeys={["graphing", "statistics"]}
                mainTitle="Analysis"
                subTitles={["Graphing", "Statistics"]}
                content={[
                    <Graphing
                        time={time}
                        key="graph"
                        changeTime={changeTime}
                        graphData={graphData}
                    />,
                    null,
                ]}
            />
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: getCurrentTime(state),
        graphData: getGraphData(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
    requestMetadata,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ResultsPanel);
