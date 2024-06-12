import React, { useEffect, useMemo } from "react";
import { Divider } from "antd";
import classNames from "classnames";

import { AgentMetadata, PositionRotation } from "../../constants/interfaces";
import { FilledCaret } from "../Icons";
import { AgentDisplayNode } from "../AgentTree";

import styles from "./style.css";

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
    selectedAgent: AgentMetadata;
    uiDisplayData: AgentDisplayNode[];
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
    selectedAgent,
    uiDisplayData,
}) => {
    const [panelExpanded, setPanelExpanded] = React.useState(false);
    const [previousId, setPreviousId] = React.useState(0);

    const agentSelected = !!selectedAgent.uniqueId;
    const selectedAgentNotRendered =
        selectedAgent.agentType >= uiDisplayData.length;

    useEffect(() => {
        if (!agentSelected) {
            setPanelExpanded(false);
            return;
        }
        if (previousId !== selectedAgent.uniqueId) {
            setPanelExpanded(true);
        }
        setPreviousId(selectedAgent.uniqueId);
    }, [selectedAgent]);

    const getFormattedValue = (
        key: string,
        value: number | PositionRotation
    ): JSX.Element | string => {
        if (selectedAgentNotRendered) {
            return "-";
        }
        if (key === "agentType") {
            return uiDisplayData[selectedAgent.agentType].title;
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
        return formatFloatForDisplay(value);
    };

    const getMetadataRows = useMemo(() => {
        const keys = Object.keys(selectedAgent) as (keyof AgentMetadata)[];
        return keys.map((key, index) => (
            <React.Fragment key={key}>
                <div className={styles.row}>
                    <div className={styles.key}>{MetadataLabels[key]}</div>
                    <div className={styles.value}>
                        {getFormattedValue(key, selectedAgent[key])}
                    </div>
                </div>
                {index < keys.length - 1 && (
                    <Divider className={styles.divider} />
                )}
            </React.Fragment>
        ));
    }, [selectedAgent, selectedAgentNotRendered]);

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
                <div className={styles.panelContents}>
                    {renderPanelContent()}
                </div>
            )}
        </div>
    );
};

export default MetadataPanel;
