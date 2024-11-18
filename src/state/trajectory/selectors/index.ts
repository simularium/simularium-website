import { createSelector } from "reselect";

import {
    isNetworkSimFileInterface,
    LocalSimFile,
    NetworkedSimFile,
} from "../types";
import { getSimulariumFile } from "./basic";

export const getIsNetworkedFile = createSelector(
    [getSimulariumFile],
    (simFile: LocalSimFile | NetworkedSimFile): boolean => {
        if (!simFile.name) {
            return false;
        }
        return isNetworkSimFileInterface(simFile);
    }
);

export * from "./basic";
