import React, { useEffect, useMemo } from "react";
import { Divider } from "antd";
import classNames from "classnames";
// todo bump this export in viewer to top level or redeclare here
import { AgentData } from "@aics/simularium-viewer/type-declarations/simularium/types";

import { FilledCaret } from "../Icons";
import { AgentDisplayNode } from "../AgentTree";

import styles from "./style.css";

interface PositionRotation {
    x: number;
    y: number;
    z: number;
}

type AgentMetadataValue = number | string | PositionRotation;

interface AgentMetadata {
    uniqueId: number;
    agentType: string;
    position: PositionRotation;
    rotation: PositionRotation;
    radius: number;
}

const MetadataLabels: Record<keyof AgentMetadata, JSX.Element> = {
    uniqueId: <span>Unique ID</span>,
    agentType: <span>Agent Type</span>,
    position: <span>Position</span>,
    rotation: (
        <>
            Rotation
            <br />
            (degrees)
        </>
    ),
    radius: <span>Radius</span>,
};

const formatFloatForDisplay = (float: number): string => {
    return parseFloat(float.toPrecision(2)).toString();
};
interface MetadataPanelProps {
    selectedAgent: AgentData;
    uiDisplayData: AgentDisplayNode[];
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
    selectedAgent,
    uiDisplayData,
}) => {
    const [panelExpanded, setPanelExpanded] = React.useState(false);
    const [agentMetadata, setAgentMetadata] = React.useState<AgentMetadata>({
        uniqueId: -1,
        agentType: "",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        radius: 0,
    });

    const agentSelected = !!selectedAgent;
    const selectedAgentNotRendered = selectedAgent.type >= uiDisplayData.length;

    useEffect(() => {
        if (agentSelected) {
            if (
                selectedAgent &&
                agentMetadata.uniqueId !== selectedAgent.instanceId
            ) {
                setPanelExpanded(true);
            }
            setAgentMetadata({
                uniqueId: selectedAgent.instanceId,
                agentType: uiDisplayData[selectedAgent.type]?.title ?? "",
                position: {
                    x: selectedAgent.x,
                    y: selectedAgent.y,
                    z: selectedAgent.z,
                },
                rotation: {
                    x: selectedAgent.xrot,
                    y: selectedAgent.yrot,
                    z: selectedAgent.zrot,
                },
                radius: selectedAgent.cr,
            });
        } else {
            setPanelExpanded(false);
        }
    }, [selectedAgent]);

    const getFormattedValue = (
        value: AgentMetadataValue
    ): JSX.Element | string => {
        if (selectedAgentNotRendered) {
            return "-";
        }
        if (typeof value === "object") {
            return (
                <>
                    <div> x = {formatFloatForDisplay(value.x)}</div>
                    <div> y = {formatFloatForDisplay(value.y)}</div>
                    <div> z = {formatFloatForDisplay(value.z)}</div>
                </>
            );
        }
        return typeof value === "number" ? formatFloatForDisplay(value) : value;
    };

    const getMetadataRows = useMemo(() => {
        const keys = Object.keys(agentMetadata) as (keyof AgentMetadata)[];
        return keys.map((key, index) => (
            <React.Fragment key={key}>
                <div className={styles.row}>
                    <div className={styles.key}>{MetadataLabels[key]}</div>
                    <div className={styles.value}>
                        {getFormattedValue(agentMetadata[key])}
                    </div>
                </div>
                {index < keys.length - 1 && (
                    <Divider className={styles.divider} />
                )}
            </React.Fragment>
        ));
    }, [agentMetadata, selectedAgentNotRendered]);

    const renderPanelContent = (): JSX.Element => {
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
                {getMetadataRows}
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div
                className={classNames(
                    panelExpanded ? styles.contentVisible : styles.collapsed,
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
                    <div className={styles.panelContents}>
                        {renderPanelContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetadataPanel;
