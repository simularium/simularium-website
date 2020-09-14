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
import { getPlotData } from "../../state/metadata/selectors";

interface ResultsPanelProps {
    plotData: any;
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
        const { changeTime, time, plotData } = this.props;
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
                        plotData={plotData}
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
        plotData: getPlotData(state),
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
