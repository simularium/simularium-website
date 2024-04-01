import React, { useEffect } from "react";
import { Divider } from "antd";

import styles from "./style.css";
import { DownCaretFilled, UpCaretFilled } from "../Icons";
import { UIDisplayData } from "@aics/simularium-viewer";
import { AgentDisplayNode } from "../AgentTree";
import { AgentData } from "@aics/simularium-viewer/type-declarations/simularium/types";

interface MetadataPanelProps {
    followObject: AgentData;
    uidisplayData: AgentDisplayNode[];
}

interface AgentMetadata {
    uniqueId?: number;
    agentType?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    raidus?: number;
    velocity?: { value: number; distanceUnit: string; timeUnit: string };
}
const MetadataPanel: React.FC<MetadataPanelProps> = (props) => {
    const { followObject, uidisplayData } = props;

    const [panelExpanded, setPanelExpanded] = React.useState(false);
    const [agentMetadata, setAgentMetadata] = React.useState<AgentMetadata>({});

    /*
todos:
get radius
get velocity
update meta data in real time during playback (position is static on selection of agent currently)
general clean up
only metadata when side panel i open
add "agent has left the simulation" message
add null state for when no agent is selected
*/
    useEffect(() => {
        console.log("meta data panel", followObject, uidisplayData);
        let agentType = "";
        if (
            uidisplayData[followObject.type] !== undefined &&
            uidisplayData[followObject.type].title !== undefined
        ) {
            agentType = uidisplayData[followObject.type].title;
        }
        const position = {
            x: followObject.x,
            y: followObject.y,
            z: followObject.z,
        };
        const rotation = {
            x: followObject.xrot,
            y: followObject.yrot,
            z: followObject.zrot,
        };
        setAgentMetadata({
            ...agentMetadata,
            uniqueId: followObject.instanceId,
            agentType: agentType,
            position: position,
            rotation: rotation,
        });
    }, [followObject]);

    //agent tupe is giving position, rotation, and unique id
    //agent type

    const agentWasSelected = (): void => {
        if (!panelExpanded && followObject.instanceId !== -1) {
            setPanelExpanded(true);
        }
    };
    useEffect(() => {
        agentWasSelected();
    }, [followObject]);

    const isValidKey = (key: string): key is keyof AgentMetadata => {
        return (
            key === "uniqueId" ||
            key === "agentType" ||
            key === "position" ||
            key === "rotation" ||
            key === "radius" ||
            key === "velocity"
        );
    };

    const getPanelRow = (key: keyof AgentMetadata, value: any): JSX.Element => {
        if (key === "position" || key === "rotation") {
            return (
                <div className={styles.row}>
                    <div className={styles.key}>{key}</div>
                    <div className={styles.value}>
                        {value.x}, {value.y}, {value.z}
                    </div>
                </div>
            );
        } else if (key === "velocity") {
            return (
                <div className={styles.row}>
                    <div className={styles.key}>{key}</div>
                    <div className={styles.value}>
                        {value.value} {value.distanceUnit}/{value.timeUnit}
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.row}>
                <div className={styles.key}>{key}</div>
                <div className={styles.value}>{value}</div>
            </div>
        );
    };

    const getPanelContents = (agentMetadata: AgentMetadata): JSX.Element[] => {
        const panelRows: JSX.Element[] = [];
        for (const key in agentMetadata) {
            if (isValidKey(key)) {
                panelRows.push(getPanelRow(key, agentMetadata[key]));
            }
        }
        return panelRows;
    };

    const panelContents = getPanelContents(agentMetadata);

    // (
    //     <div>
    //                     {for (const key in AgentMetadata ) {
    //          getPanelRow(key, agentMetadata[key]) }}
    //          </div>

    // rows
    //each row has a key field of equal width
    // then a value field
    // between rows a divider

    // value fields can be one offs, or for the x,y,zs they are three values

    // );

    const panelContent = (
        <div
            className={panelExpanded ? styles.contentExpanded : styles.content}
        >
            <div className={styles.title}>
                <div> Agent Metadata</div>
                <button
                    className={styles.icon}
                    onClick={() => setPanelExpanded(!panelExpanded)}
                >
                    {panelExpanded ? DownCaretFilled : UpCaretFilled}
                </button>
            </div>
            {panelExpanded && <div> {panelContents} </div>}
        </div>
    );

    return (
        <div className={styles.container}>
            <Divider className={styles.divider} />
            {panelContent}
        </div>
    );
};

export default MetadataPanel;
