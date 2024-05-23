import { State } from "../../types";

export const getPlotData = (state: State) => state.trajectory.plotData;
export const getFirstFrameTimeOfCachedSimulation = (state: State) =>
    state.trajectory.firstFrameTime;
export const getLastFrameTimeOfCachedSimulation = (state: State) =>
    state.trajectory.lastFrameTime;
export const getNumFrames = (state: State) => state.trajectory.numFrames;
export const getTimeStep = (state: State) => state.trajectory.timeStep;
export const getTimeUnits = (state: State) => state.trajectory.timeUnits;
export const getScaleBarLabel = (state: State) =>
    state.trajectory.scaleBarLabel;
export const getSimulariumFile = (state: State) =>
    state.trajectory.simulariumFile;
export const getAgentDisplayNamesAndStates = (state: State) =>
    state.trajectory.agentUiNames;
export const getConversionProcessingData = (state: State) =>
    state.trajectory.processingData;
export const getConversionStatus = (state: State) =>
    state.trajectory.conversionStatus;
export const getSessionUIData = (state: State) =>
    state.trajectory.sessionUIData;
