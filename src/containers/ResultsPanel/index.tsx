import * as React from "react";
// import { ActionCreator } from "redux";
import { connect } from "react-redux";

import SideBarContents from "../../components/SideBarContents";
import Plot from "../../components/Plot";
// import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
// import { changeTime } from "../../state/selection/actions";
// import { ChangeTimeAction } from "../../state/selection/types";

import { PlotParamsWithKey } from "./types";
import { getPlotDataConfiguredForPlotly } from "./selectors";

const styles = require("./style.css");

interface ResultsPanelProps {
    plotConfigs: PlotParamsWithKey[];
    // time: number;
    // changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
    public render(): JSX.Element {
        const { plotConfigs } = this.props;
        const content =
            plotConfigs && plotConfigs.length > 0
                ? [
                      <div key="plots">
                          {plotConfigs.map((plotConfig) => (
                              <Plot
                                  key={plotConfig.key}
                                  plotConfig={plotConfig}
                              />
                          ))}
                      </div>,
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
        // time: getCurrentTime(state),
        plotConfigs: getPlotDataConfiguredForPlotly(state),
    };
}

// const dispatchToPropsMap = {
//     changeTime,
// };

export default connect(
    mapStateToProps
    // dispatchToPropsMap
)(ResultsPanel);
