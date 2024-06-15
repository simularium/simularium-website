import * as React from "react";
import { Card, Divider } from "antd";

import { AgentMetadata } from "../../constants/interfaces";
import MetadataPanel from "../MetadataPanel";
import { AgentDisplayNode } from "../AgentTree";

import styles from "./style.css";
interface SideBarContentsProps {
    mainTitle: string;
    content: (JSX.Element | null)[];
    selectedAgent?: AgentMetadata;
    uiDisplayData?: AgentDisplayNode[];
}

const SideBarContents: React.FC<SideBarContentsProps> = ({
    mainTitle,
    content,
    selectedAgent,
    uiDisplayData = [],
}) => {
    const showMetadataPanel = selectedAgent && uiDisplayData.length > 0;

    return (
        <div className={styles.container}>
            <Card title={mainTitle} className={styles.card} bordered={false}>
                {content[0]}
            </Card>
            {showMetadataPanel && (
                <>
                    <Divider className={styles.divider}></Divider>
                    <div>
                        <MetadataPanel
                            selectedAgent={selectedAgent}
                            uiDisplayData={uiDisplayData}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SideBarContents;
