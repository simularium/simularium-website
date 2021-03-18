/* Performs actions dependent on the trajectory file format version */

import {
    TrajectoryFileInfo,
    TrajectoryFileInfoV1,
    TrajectoryFileInfoV2,
} from "@aics/simularium-viewer/type-declarations/simularium";
const si = require("si-prefix");

export const makeScaleBarLabel = (
    tickIntervalLength: number,
    data: TrajectoryFileInfo
): string => {
    let scaleBarLabelNumber: number;
    let scaleBarLabelUnit: string;

    switch (data.version) {
        case 1:
            const dataV1 = data as TrajectoryFileInfoV1;

            // Format scale bar length and unit so that it's more readable, e.g.:
            // 0.000000015 m -> [15, "nm"]
            const scaleBarLabelArray = si.meter.convert(
                tickIntervalLength * dataV1.spatialUnitFactorMeters
            );
            scaleBarLabelNumber = parseFloat(
                scaleBarLabelArray[0].toPrecision(2)
            );
            // The si-prefix library abbreviates "micro" as "mc", so swap it out with "µ"
            scaleBarLabelUnit = scaleBarLabelArray[1].replace("mc", "µ");

            break;
        case 2:
            const dataV2 = data as TrajectoryFileInfoV2;
            scaleBarLabelNumber =
                tickIntervalLength * dataV2.spatialUnits.magnitude;
            scaleBarLabelUnit = dataV2.spatialUnits.name;
            break;
        default:
            throw "Invalid version number in TrajectoryFileInfo";
    }

    return scaleBarLabelNumber + " " + scaleBarLabelUnit;
};
