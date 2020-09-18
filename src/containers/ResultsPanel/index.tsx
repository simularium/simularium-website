import * as React from "react";
import { ActionCreator } from "redux";
import CollaspableMenu from "../../components/NestedMenus";

import Graphing from "../../components/Plots";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import { ChangeTimeAction } from "../../state/selection/types";
import { getPlotData } from "../../state/metadata/selectors";

interface ResultsPanelProps {
    plotData: any;
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
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
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ResultsPanel);
