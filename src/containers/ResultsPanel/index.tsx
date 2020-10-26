import * as React from "react";
import { ActionCreator } from "redux";
import { connect } from "react-redux";

import SideBarContents from "../../components/SideBarContents";
import Plots from "../../components/Plots";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { changeTime } from "../../state/selection/actions";
import { ChangeTimeAction } from "../../state/selection/types";

import { PlotParamsWithKey } from "./types";
import { configurePlots } from "./selectors";

const styles = require("./style.css");

interface ResultsPanelProps {
    plotConfig: PlotParamsWithKey[];
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
    public render(): JSX.Element {
        const { changeTime, time, plotConfig } = this.props;
        const content =
            plotConfig && plotConfig.length > 0
                ? [
                      <Plots
                          time={time}
                          key="graph"
                          changeTime={changeTime}
                          plotConfig={plotConfig}
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
        plotConfig: configurePlots(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ResultsPanel);
