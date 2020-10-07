import * as React from "react";
import { ActionCreator } from "redux";
import NestedMenus from "../../components/NestedMenus";

import Graphing from "../../components/Plots";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import { ChangeTimeAction } from "../../state/selection/types";
import { getPlotData } from "../../state/metadata/selectors";

const styles = require("./style.css");

interface ResultsPanelProps {
    plotData: any;
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
    public render(): JSX.Element {
        const { changeTime, time, plotData } = this.props;
        return (
            <div className={styles.container}>
                <NestedMenus
                    // Uncomment below when we want multiple collapsible sections
                    // panelKeys={["graphing", "statistics"]}
                    mainTitle="Plots"
                    // subTitles={["Graphing", "Statistics"]}
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
