import * as React from "react";
import { ActionCreator } from "redux";
import SideBarContents from "../../components/SideBarContents";

import Plots from "../../components/Plots";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { PlotInterface } from "../../components/Plots/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import { ChangeTimeAction } from "../../state/selection/types";
import { getPlotData } from "../../state/metadata/selectors";

const styles = require("./style.css");

interface ResultsPanelProps {
    plotData: PlotInterface[];
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
    public render(): JSX.Element {
        const { changeTime, time, plotData } = this.props;
        const content = plotData
            ? [
                  <Plots
                      time={time}
                      key="graph"
                      changeTime={changeTime}
                      plotData={plotData}
                  />,
              ]
            : [];
        return (
            <div className={styles.container}>
                <SideBarContents mainTitle="Plots" content={content} />
            </div>
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
