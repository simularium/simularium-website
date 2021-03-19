/* Performs actions dependent on the trajectory file format version */

import {
    TrajectoryFileInfo,
    TrajectoryFileInfoV1,
    TrajectoryFileInfoV2,
} from "@aics/simularium-viewer/type-declarations/simularium";
const si = require("si-prefix");

import { TimeUnits } from "../state/metadata/types";

const invalidVersionNumberError =
    "Invalid version number in TrajectoryFileInfo";

export const getScaleBarLabelByVersion = (
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
            throw invalidVersionNumberError;
    }

    return scaleBarLabelNumber + " " + scaleBarLabelUnit;
};

export const getMetadataByVersion = (data: TrajectoryFileInfo) => {
    switch (data.version) {
        case 1:
            const dataV1 = data as TrajectoryFileInfoV1;
            return {
                timeStepSize: dataV1.timeStepSize,
                timeUnits: null,
            };
        case 2:
            const dataV2 = data as TrajectoryFileInfoV2;
            return {
                timeStepSize: dataV2.timeStepSize * dataV2.timeUnits.magnitude,
                timeUnits: dataV2.timeUnits,
            };
        default:
            throw invalidVersionNumberError;
    }
};

/* 
In version 1, all incoming times are in seconds, but we want to determine the best unit for 
displaying. We do this by calculating how many times (rounded up) the inverse of lastFrameTime 
can divide by 1000.
*/
const unitStrings = ["s", "ms", "\u03BCs", "ns"];
const getTimeUnitIndex = (lastFrameTime: number): number => {
    // Math.log(x) / Math.log(1000) is the same as log base 1000 of x:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log/#Examples
    let index = Math.ceil(Math.log(1 / lastFrameTime) / Math.log(1000));

    if (index >= unitStrings.length) {
        // Handle very small values (use ns if lastFrameTime is less than 1 ns)
        index = unitStrings.length - 1;
    } else if (index < 0) {
        // Handle very large values (use s if lastFrameTime is greater than 1000 s)
        index = 0;
    }

    // `index` corresponds to the index of the unit in the array `units`
    return index;
};

const roundTime = (num: number) => parseFloat(Number(num).toPrecision(3));

export const getRoundedTimeByVersion = (
    version: number,
    time: number,
    timeUnits: TimeUnits | null,
    lastFrameTime: number
) => {
    switch (version) {
        case 1:
            const unitIndex = getTimeUnitIndex(lastFrameTime);
            return roundTime(time * 1000 ** unitIndex);
        case 2:
            const units = timeUnits as TimeUnits;
            return roundTime(time * units.magnitude);
        default:
            throw invalidVersionNumberError;
    }
};

export const getTimeUnitLabelByVersion = (
    version: number,
    timeUnits: TimeUnits | null,
    lastFrameTime: number
) => {
    switch (version) {
        case 1:
            const unitIndex = getTimeUnitIndex(lastFrameTime);
            return unitStrings[unitIndex];
        case 2:
            const units = timeUnits as TimeUnits;
            return units.name;
        default:
            throw invalidVersionNumberError;
    }
};
