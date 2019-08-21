import * as React from "react";
import { Card, Collapse } from "antd";
import { ActionCreator } from "redux";

import Graphing from "../../components/Graphing";
import { getCurrentTime } from "../../state/selection/selectors";
import { State } from "../../state/types";
import { connect } from "react-redux";
import { changeTime } from "../../state/selection/actions";
import { ChangeTimeAction } from "../../state/selection/types";

const { Panel } = Collapse;

const styles = require("./style.css");
const panelKeys = ["graphing", "statistics"];

interface ResultsPanelProps {
    time: number;
    changeTime: ActionCreator<ChangeTimeAction>;
}

class ResultsPanel extends React.Component<ResultsPanelProps, {}> {
    public render(): JSX.Element {
        const { changeTime, time } = this.props;
        return (
            <Card title="Analysis" className={styles.container}>
                <Collapse defaultActiveKey={panelKeys}>
                    <Panel
                        showArrow={false}
                        key={panelKeys[0]}
                        header="Graphing"
                    >
                        <Graphing time={time} changeTime={changeTime} />
                    </Panel>
                    <Panel
                        showArrow={false}
                        key={panelKeys[1]}
                        header="Statistics"
                    />
                </Collapse>
            </Card>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        time: getCurrentTime(state),
    };
}

const dispatchToPropsMap = {
    changeTime,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(ResultsPanel);
