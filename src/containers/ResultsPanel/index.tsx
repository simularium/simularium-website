import * as React from "react";
import { Collapse } from "antd";

import Graphing from "../../components/Graphing/index";

const { Panel } = Collapse;

const styles = require("./style.css");
const panelKeys = ["graphing", "statistics"];
export default class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Collapse defaultActiveKey={panelKeys}>
                <Panel showArrow={false} key={panelKeys[0]} header="Graphing">
                    <Graphing />
                </Panel>
                <Panel
                    showArrow={false}
                    key={panelKeys[1]}
                    header="Statistics"
                />
            </Collapse>
        );
    }
}
