// This component is currently unused

import * as React from "react";
import { Card, Collapse } from "antd";

const { Panel } = Collapse;

import styles from "./style.css";

interface NestedMenusProps {
    panelKeys: string[];
    mainTitle: string;
    subTitles: string[];
    content: (JSX.Element | null)[];
}

export default class NestedMenus extends React.Component<NestedMenusProps> {
    public render(): JSX.Element {
        const { panelKeys, mainTitle, subTitles, content } = this.props;
        return (
            <Card
                title={mainTitle}
                className={styles.container}
                bordered={false}
            >
                <Collapse defaultActiveKey={panelKeys}>
                    {panelKeys.map((key: string, i: number) => (
                        <Panel
                            showArrow={false}
                            key={key}
                            header={subTitles[i]}
                        >
                            {content[i]}
                        </Panel>
                    ))}
                </Collapse>
            </Card>
        );
    }
}
