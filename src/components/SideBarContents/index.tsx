import * as React from "react";
import { Card, Divider } from "antd";
import { AgentData } from "@aics/simularium-viewer/type-declarations/simularium/types";

import MetadataPanel from "../MetadataPanel";
import { AgentDisplayNode } from "../AgentTree";

import styles from "./style.css";
interface SideBarContentsProps {
    mainTitle: string;
    content: (JSX.Element | null)[];
    followObject?: AgentData;
    hasMetadataPanel?: boolean;
    uidisplayData?: AgentDisplayNode[];
}

const SideBarContents: React.FC<SideBarContentsProps> = ({
    mainTitle,
    content,
    followObject,
    hasMetadataPanel,
    uidisplayData = [],
}) => {
    const showMetadataPanel =
        hasMetadataPanel && followObject && uidisplayData.length > 0;

    return (
        <div className={styles.container}>
            <Card title={mainTitle} className={styles.card} bordered={false}>
                <div className={styles.agentContainer}>{content[0]}</div>
            </Card>
            {showMetadataPanel && (
                <>
                    <Divider className={styles.divider}></Divider>
                    <MetadataPanel
                        followObject={followObject}
                        uiDisplayData={uidisplayData}
                    />
                </>
            )}
        </div>
    );
};

export default SideBarContents;
