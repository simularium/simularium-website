import * as React from "react";
import { Card, Divider } from "antd";

import { AgentMetadata } from "../../constants/interfaces";
import MetadataPanel from "../MetadataPanel";
import { AgentDisplayNode } from "../AgentTree";

import styles from "./style.css";
interface SideBarContentsProps {
    mainTitle: string;
    content: (JSX.Element | null)[];
    selectedAgentMetadata?: AgentMetadata;
    uiDisplayData?: AgentDisplayNode[];
}

const SideBarContents: React.FC<SideBarContentsProps> = ({
    mainTitle,
    content,
    selectedAgentMetadata,
    uiDisplayData = [],
}) => {
    const showMetadataPanel = selectedAgentMetadata && uiDisplayData.length > 0;

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
                            selectedAgentMetadata={selectedAgentMetadata}
                            uiDisplayData={uiDisplayData}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SideBarContents;
