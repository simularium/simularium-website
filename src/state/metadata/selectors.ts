import { createSelector } from "reselect";

import { State } from "../types";

import { MetadataStateBranch } from "./types";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getTotalTimeOfCachedSimulation = (state: State) =>
    state.metadata.totalTime;
export const getTimeStepSize = (state: State) => state.metadata.timeStepSize;
// COMPOSED SELECTORS
export const getKeysOfMetadata = createSelector(
    [getMetadata],
    (metadata: MetadataStateBranch): string[] => Object.keys(metadata)
);
