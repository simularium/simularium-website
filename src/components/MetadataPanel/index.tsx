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

const MetadataLabels: { [key: string]: JSX.Element } = {
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

const isValidKey = (key: string): key is keyof AgentMetadata => {
    return Object.keys(MetadataLabels).includes(key);
};
interface MetadataPanelProps {
    followObject: AgentData;
    uiDisplayData: AgentDisplayNode[];
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
    followObject,
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

    const agentSelected = followObject.instanceId !== -1;
    const selectedAgentNotRendered = followObject.type >= uiDisplayData.length;

    useEffect(() => {
        if (agentSelected) {
            setPanelExpanded(true);
            setAgentMetadata({
                uniqueId: followObject.instanceId,
                agentType: uiDisplayData[followObject.type]?.title ?? "",
                position: {
                    x: followObject.x,
                    y: followObject.y,
                    z: followObject.z,
                },
                rotation: {
                    x: followObject.xrot,
                    y: followObject.yrot,
                    z: followObject.zrot,
                },
                radius: followObject.cr,
            });
        } else {
            setPanelExpanded(false);
        }
    }, [followObject]);

    const formatFloatForDisplay = (float: number): string => {
        return parseFloat(float.toPrecision(2)).toString();
    };

    const getFormattedValue = (
        value: AgentMetadataValue
    ): JSX.Element | string => {
        if (selectedAgentNotRendered) {
            return "-";
        }
        if (typeof value === "object") {
            const posRot = value as PositionRotation;
            return (
                <>
                    <div> x = {formatFloatForDisplay(posRot.x)}</div>
                    <div> y = {formatFloatForDisplay(posRot.y)}</div>
                    <div> z = {formatFloatForDisplay(posRot.z)}</div>
                </>
            );
        }
        if (typeof value === "number") {
            return <div> {formatFloatForDisplay(value as number)}</div>;
        }
        return value;
    };

    const getMetadataRows = useMemo(() => {
        return Object.keys(agentMetadata).map((key, index) => {
            if (isValidKey(key)) {
                return (
                    <React.Fragment key={key}>
                        <div className={styles.row}>
                            <div className={styles.key}>
                                {MetadataLabels[key]}
                            </div>
                            <div className={styles.value}>
                                {getFormattedValue(agentMetadata[key])}
                            </div>
                        </div>
                        {index < Object.keys(agentMetadata).length - 1 && (
                            <Divider className={styles.divider} />
                        )}
                    </React.Fragment>
                );
            }
            return null;
        });
    }, [agentMetadata]);

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
                        Agent no longer in the simulation
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
                    agentSelected ? styles.agentSelected : null,
                    panelExpanded ? styles.contentVisible : styles.collapsed
                )}
            >
                <div className={styles.title}>
                    <h3>Agent Metadata</h3>
                    <button
                        className={classNames(
                            styles.icon,
                            !panelExpanded ? styles.rotate : null
                        )}
                        onClick={() => setPanelExpanded(!panelExpanded)}
                    >
                        {FilledCaret}
                    </button>
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
