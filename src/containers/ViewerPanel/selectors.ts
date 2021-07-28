import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { createSelector } from "reselect";
import {
    getLastFrameTimeOfCachedSimulation,
    getTimeUnits,
    getTimeStep,
    getFirstFrameTimeOfCachedSimulation,
} from "../../state/trajectory/selectors";
import {
    getAgentsToHide,
    getCurrentTime,
    getHightLightedAgents,
} from "../../state/selection/selectors";
import {
    AgentColorMap,
    VisibilitySelectionMap,
} from "../../state/selection/types";
import { roundTimeForDisplay } from "../../util";
import { DisplayTimes } from "./types";

export const getSelectionStateInfoForViewer = createSelector(
    [getHightLightedAgents, getAgentsToHide],
    (highlightedAgents, hiddenAgents) => ({
        highlightedAgents,
        hiddenAgents,
    })
);

export const convertUIDataToSelectionData = (
    uiData: UIDisplayData
): VisibilitySelectionMap => {
    const returnData: VisibilitySelectionMap = {};
    return uiData.reduce((acc, agent) => {
        acc[agent.name] = [];
        if (agent.displayStates && agent.displayStates.length > 0) {
            acc[agent.name] = [
                "", // unmodified state
                ...agent.displayStates.map((state) => state.name),
            ];
        } else {
            acc[agent.name] = [agent.name];
        }
        return acc;
    }, returnData);
};

export const convertUIDataToColorMap = (
    uiData: UIDisplayData
): AgentColorMap => {
    const returnData: AgentColorMap = {};
    return uiData.reduce((acc, agent) => {
        acc[agent.name] = agent.color;
        return acc;
    }, returnData);
};

// Determine the likely max number of characters for the time input box
export const getMaxNumChars = (
    firstFrameTime: number,
    lastFrameTime: number,
    timeStep: number
) => {
    // If lastFrameTime is 15 and step size is 0.2 then 15.2 is probably going to have
    // the max number of characters for this trajectory
    const refTimeValue = lastFrameTime + timeStep;
    const roundedRefTime = roundTimeForDisplay(refTimeValue).toString();

    // Edge case: If firstFrameTime is a very small but long number like 0.000008,
    // we need to accommodate that.
    const maxNumChars = Math.max(
        firstFrameTime.toString().length,
        roundedRefTime.length
    );

    return maxNumChars;
};

export const getDisplayTimes = createSelector(
    [
        getCurrentTime,
        getTimeUnits,
        getTimeStep,
        getFirstFrameTimeOfCachedSimulation,
        getLastFrameTimeOfCachedSimulation,
    ],
    (
        time,
        timeUnits,
        timeStep,
        firstFrameTime,
        lastFrameTime
    ): DisplayTimes => {
        let roundedTime = 0;
        let roundedFirstFrameTime = 0;
        let roundedLastFrameTime = 0;
        let roundedTimeStep = 0;

        if (timeUnits) {
            roundedTime = roundTimeForDisplay(time * timeUnits.magnitude);
            roundedFirstFrameTime = roundTimeForDisplay(
                firstFrameTime * timeUnits.magnitude
            );
            roundedLastFrameTime = roundTimeForDisplay(
                lastFrameTime * timeUnits.magnitude
            );
            roundedTimeStep = roundTimeForDisplay(
                timeStep * timeUnits.magnitude
            );
        }

        const maxNumChars = getMaxNumChars(
            roundedFirstFrameTime,
            roundedLastFrameTime,
            roundedTimeStep
        );

        return {
            roundedTime: roundedTime,
            roundedLastFrameTime: roundedLastFrameTime,
            roundedTimeStep: roundedTimeStep,
            maxNumChars: maxNumChars,
        };
    }
);
