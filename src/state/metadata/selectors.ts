import { createSelector } from "reselect";
import { uniq } from "lodash";
import { State } from "../types";

import { MetadataStateBranch } from "./types";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { TreeNodeNormal } from "antd/lib/tree/Tree";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getGraphData = (state: State) => state.metadata.graphData;
export const getTotalTimeOfCachedSimulation = (state: State) =>
    state.metadata.totalTime;
export const getTimeStepSize = (state: State) => state.metadata.timeStepSize;
export const getAgentIds = (state: State) => state.metadata.agentIds;
export const getSimulariumFile = (state: State) =>
    state.metadata.simulariumFile;
export const getSimulariumController = (state: State) =>
    state.metadata.simulariumController;
// COMPOSED SELECTORS
export const getKeysOfMetadata = createSelector(
    [getMetadata],
    (metadata: MetadataStateBranch): string[] => Object.keys(metadata)
);

export const getAgentDisplayNamesAndStates = (state: State) =>
    state.metadata.agentUiNames;

export const getAllTags = createSelector(
    [getAgentDisplayNamesAndStates],
    (uiDisplayData: UIDisplayData) => {
        return uniq(
            uiDisplayData.reduce(
                (acc, currentAgent) => {
                    acc = [
                        ...acc,
                        ...currentAgent.displayStates.map(
                            (state) => state.name
                        ),
                    ];
                    return acc;
                },
                [] as string[]
            )
        );
    }
);

const makeDataTreeKey = (renderType: string, name: string, tagId: string) =>
    `${renderType}-${name}-${tagId}`;

export const getUiDisplayDataTreeVisibility = createSelector(
    [getAgentDisplayNamesAndStates],
    (uiDisplayData: UIDisplayData): TreeNodeNormal[] => {
        return uiDisplayData.map((agent) => ({
            title: agent.name,
            key: agent.name,
            children: agent.displayStates.map((state) => ({
                title: state.name,
                key: makeDataTreeKey("v", agent.name, state.id),
            })),
        }));
    }
);

export const getUiDisplayDataTreeHighlight = createSelector(
    [getAgentDisplayNamesAndStates],
    (uiDisplayData: UIDisplayData): TreeNodeNormal[] => {
        return uiDisplayData.map((agent) => ({
            title: agent.name,
            key: agent.name,
            children: agent.displayStates.map((state) => ({
                title: state.name,
                key: makeDataTreeKey("hl", agent.name, state.id),
            })),
        }));
    }
);
