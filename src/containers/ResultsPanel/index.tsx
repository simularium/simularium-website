import * as React from "react";
import { connect } from "react-redux";

import SideBarContents from "../../components/SideBarContents";
import Plot from "../../components/Plot";
import { State } from "../../state/types";

import { PlotConfig } from "./types";
import { getPlotDataConfiguredForPlotly } from "./selectors";

const styles = require("./style.css");

interface ResultsPanelProps {
    plotConfigs: PlotConfig[];
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
        plotConfigs: getPlotDataConfiguredForPlotly(state),
    };
}

export default connect(mapStateToProps)(ResultsPanel);
