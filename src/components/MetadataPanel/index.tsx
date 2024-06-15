import React, { useEffect, useMemo } from "react";
import { Divider } from "antd";
import classNames from "classnames";

import { AgentMetadata, MetadataDisplay } from "../../constants/interfaces";
import { formatFloatForDisplay } from "../../util";
import { FilledCaret } from "../Icons";
import { AgentDisplayNode } from "../AgentTree";

import styles from "./style.css";

interface MetadataPanelProps {
    selectedAgent: AgentMetadata;
    uiDisplayData: AgentDisplayNode[];
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
    selectedAgent,
    uiDisplayData,
}) => {
    const [panelExpanded, setPanelExpanded] = React.useState(false);

    const agentSelected = !!selectedAgent.uniqueId;
    const selectedAgentNotRendered =
        selectedAgent.agentType >= uiDisplayData.length;

    useEffect(() => {
        if (!agentSelected) {
            setPanelExpanded(false);
        } else {
            setPanelExpanded(true);
        }
    }, [selectedAgent.uniqueId]);

    const displayValues: Record<keyof AgentMetadata, MetadataDisplay> = {
        uniqueId: {
            label: <span>Unique ID</span>,
            value: () => formatFloatForDisplay(selectedAgent.uniqueId),
        },
        agentType: {
            label: <span>Agent Type</span>,
            value: () => uiDisplayData[selectedAgent.agentType].title,
        },
        position: {
            label: <span>Position</span>,
            value: () => {
                const pos = selectedAgent.position;
                return (
                    <>
                        <div>x = {formatFloatForDisplay(pos.x)}</div>
                        <div>y = {formatFloatForDisplay(pos.y)}</div>
                        <div>z = {formatFloatForDisplay(pos.z)}</div>
                    </>
                );
            },
        },
        rotation: {
            label: (
                <>
                    Rotation
                    <br />
                    (degrees)
                </>
            ),
            value: () => {
                const rot = selectedAgent.rotation;
                return (
                    <>
                        <div>x = {formatFloatForDisplay(rot.x)}</div>
                        <div>y = {formatFloatForDisplay(rot.y)}</div>
                        <div>z = {formatFloatForDisplay(rot.z)}</div>
                    </>
                );
            },
        },
        radius: {
            label: <span>Radius</span>,
            value: () => formatFloatForDisplay(selectedAgent.radius),
        },
    };

    const metadataRows = useMemo(() => {
        const keys = Object.keys(selectedAgent) as (keyof AgentMetadata)[];
        return keys.map((key, index) => (
            <React.Fragment key={key}>
                <div className={styles.row}>
                    <div className={styles.key}>{displayValues[key].label}</div>
                    <div className={styles.value}>
                        {displayValues[key].value()}
                    </div>
                </div>
                {index < keys.length - 1 && (
                    <Divider className={styles.divider} />
                )}
            </React.Fragment>
        ));
    }, [selectedAgent, selectedAgentNotRendered]);

    const panelContent = (): JSX.Element => {
        if (!agentSelected) {
            return (
                <div className={styles.noAgentRow}>
                    <p>Nothing to see here...</p>
                    <p className={styles.noAgentText}>
                        Select an agent in the viewport to view its metadata.
                    </p>
                </div>
            );
        }
        return (
            <>
                {selectedAgentNotRendered && (
                    <p className={styles.agentMissingText}>
                        Agent no longer in simulation
                    </p>
                )}
                {metadataRows}
            </>
        );
    };

    return (
        <div
            className={classNames(
                styles.container,
                { [styles.collapsed]: !panelExpanded },
                { [styles.agentSelected]: agentSelected && panelExpanded }
            )}
        >
            <div
                className={styles.title}
                onClick={() => setPanelExpanded(!panelExpanded)}
                role="button"
            >
                <h3>Agent Metadata</h3>
                <div
                    className={classNames(styles.icon, {
                        [styles.rotate]: !panelExpanded,
                    })}
                >
                    {FilledCaret}
                </div>
            </div>
            {panelExpanded && (
                <div className={styles.panelContents}>{panelContent()}</div>
            )}
        </div>
    );
};

export default MetadataPanel;
