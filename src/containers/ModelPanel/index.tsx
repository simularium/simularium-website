import * as React from "react";
import { Card, Collapse } from "antd";

const { Panel } = Collapse;

const styles = require("./style.css");
const panelKeys = ["graphing", "statistics"];
export default class ModelPanel extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <Card title="Adjustable Parameters" className={styles.container}>
                <Collapse defaultActiveKey={panelKeys}>
                    <Panel
                        showArrow={false}
                        key={panelKeys[0]}
                        header="Adjustable Parameters"
                    >
                        <Card title />
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
