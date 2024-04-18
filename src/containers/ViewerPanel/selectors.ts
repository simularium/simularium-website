import {
    ColorChange,
    SelectionStateInfo,
    UIDisplayData,
} from "@aics/simularium-viewer";
import { createSelector } from "reselect";
import {
    getLastFrameTimeOfCachedSimulation,
    getTimeUnits,
    getTimeStep,
    getFirstFrameTimeOfCachedSimulation,
} from "../../state/trajectory/selectors";
import {
    getAgentsToHide,
    getColorChange,
    getCurrentTime,
    getHighlightedAgents,
} from "../../state/selection/selectors";
import { AgentRenderingCheckboxMap } from "../../state/selection/types";
import { roundTimeForDisplay } from "../../util";
import { DisplayTimes } from "./types";

export const getSelectionStateInfoForViewer = createSelector(
    [getHighlightedAgents, getAgentsToHide, getColorChange],
    (
        highlightedAgents,
        hiddenAgents,
        colorChange: ColorChange
    ): SelectionStateInfo => ({
        highlightedAgents,
        hiddenAgents,
        colorChange,
    })
);

export const convertUIDataToSelectionData = (
    uiData: UIDisplayData
): AgentRenderingCheckboxMap => {
    const returnData: AgentRenderingCheckboxMap = {};
    return uiData.reduce((acc, agent) => {
        acc[agent.name] = [];
        if (agent.displayStates && agent.displayStates.length > 0) {
            acc[agent.name] = [...agent.displayStates.map((state) => state.id)];
        } else {
            acc[agent.name] = [agent.name];
        }
        return acc;
    }, returnData);
};

// Determine the likely max number of characters for the time input box
export const getMaxNumChars = (
    firstFrameTime: number,
    lastFrameTime: number,
    timeStep: number
) => {
    // These two time values are likely to have the most digits
    const refTime1Value = firstFrameTime + timeStep;
    const refTime2Value = lastFrameTime + timeStep;
    const roundedRefTime1 = roundTimeForDisplay(refTime1Value).toString();
    const roundedRefTime2 = roundTimeForDisplay(refTime2Value).toString();

    // Edge case: If firstFrameTime is a very small but long number like 0.000008,
    // we need to accommodate that.
    const maxNumChars = Math.max(
        firstFrameTime.toString().length,
        roundedRefTime1.length,
        roundedRefTime2.length
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
