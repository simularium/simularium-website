import { UIDisplayData } from "@aics/simularium-viewer/type-declarations";
import { createSelector } from "reselect";
import {
    getLastFrameTimeOfCachedSimulation,
    getTimeUnits,
    getTimeStepSize,
} from "../../state/metadata/selectors";
import {
    getAgentsToHide,
    getCurrentTime,
    getHightLightedAgents,
} from "../../state/selection/selectors";
import {
    AgentColorMap,
    VisibilitySelectionMap,
} from "../../state/selection/types";
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

export const getDisplayTimes = createSelector(
    [
        getCurrentTime,
        getTimeUnits,
        getTimeStepSize,
        getLastFrameTimeOfCachedSimulation,
    ],
    (time, timeUnits, timeStepSize, lastFrameTime): DisplayTimes => {
        const roundNumber = (num: number) =>
            parseFloat(Number(num).toPrecision(3));
        let roundedTime = 0;
        let roundedLastFrameTime = 0;
        let roundedTimeStep = 0;

        if (timeUnits) {
            roundedTime = time ? roundNumber(time * timeUnits.magnitude) : 0;
            roundedLastFrameTime = roundNumber(
                lastFrameTime * timeUnits.magnitude
            );
            roundedTimeStep = roundNumber(timeStepSize);
        }

        return {
            roundedTime: roundedTime,
            roundedLastFrameTime: roundedLastFrameTime,
            roundedTimeStep: roundedTimeStep,
        };
    }
);
