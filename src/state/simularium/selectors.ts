import { createSelector } from "reselect";
import { uniq, find } from "lodash";
import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";

import TRAJECTORIES from "../../constants/networked-trajectories";
import { State } from "../types";

import { isNetworkSimFileInterface } from "./types";

// BASIC SELECTORS
export const getMetadata = (state: State) => state.metadata;
export const getPlotData = (state: State) => state.metadata.plotData;

// COMPOSED SELECTORS
export const getIsNetworkedFile = createSelector(
    [getSimulariumFile],
    (simFile: LocalSimFile | NetworkedSimFile): boolean => {
        if (!simFile.name) {
            return false;
        }
        return (
            !!find(TRAJECTORIES, { id: simFile.name }) &&
            isNetworkSimFileInterface(simFile)
        );
    }
);
