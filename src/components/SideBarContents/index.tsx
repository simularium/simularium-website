import * as React from "react";
import { Card } from "antd";

import styles from "./style.css";

interface SideBarContentsProps {
    mainTitle: string;
    content: (JSX.Element | null)[];
}

export default class SideBarContents extends React.Component<SideBarContentsProps> {
    public render(): JSX.Element {
        const { mainTitle, content } = this.props;
        return (
            <Card
                title={mainTitle}
                className={styles.container}
                bordered={false}
            >
                {content[0]}
            </Card>
        );
    }
}
