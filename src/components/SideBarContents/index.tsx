import * as React from "react";
import { Card } from "antd";

import styles from "./style.css";
import MetadataPanel from "../MetadataPanel";
import { UIDisplayData } from "@aics/simularium-viewer";
import { AgentDisplayNode } from "../AgentTree";
import { AgentData } from "@aics/simularium-viewer/type-declarations/simularium/types";

interface SideBarContentsProps {
    mainTitle: string;
    content: (JSX.Element | null)[];
    followObject?: AgentData;
    hasMetadataPanel?: boolean;
    uidisplayData?: AgentDisplayNode[];
}

export default class SideBarContents extends React.Component<SideBarContentsProps> {
    public render(): JSX.Element {
        const {
            mainTitle,
            content,
            followObject,
            hasMetadataPanel,
            uidisplayData = [],
        } = this.props;
        return (
            <div className={styles.container}>
                <Card
                    title={mainTitle}
                    className={styles.card}
                    bordered={false}
                >
                    <div className={styles.agentContainer}> {content[0]}</div>
                </Card>
                {hasMetadataPanel && followObject && (
                    <div className={styles.metadataPanel}>
                        <MetadataPanel
                            followObject={followObject}
                            uidisplayData={uidisplayData}
                        />
                    </div>
                )}
            </div>
        );
    }
}
