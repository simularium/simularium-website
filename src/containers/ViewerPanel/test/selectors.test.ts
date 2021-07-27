import { initialState } from "../../../state/index";
import { State } from "../../../state/types";
import {
    convertUIDataToColorMap,
    getDisplayTimes,
    getMaxNumChars,
} from "../selectors";

describe("ViewerPanel selectors", () => {
    describe("convertUIDataToColorMap", () => {
        it("converts UI display data to color map where the agent name is the key, and the color is the value", () => {
            const mockDisplayData = [
                {
                    name: "name",
                    displayStates: [{ name: "state1", id: "id" }],
                    color: "color",
                },
            ];
            const result = convertUIDataToColorMap(mockDisplayData);
            expect(result).toEqual({ name: "color" });
        });
        it("returns an empty object if no ui data present", () => {
            const result = convertUIDataToColorMap([]);
            expect(result).toEqual({});
        });
    });
    describe("getMaxNumChars", () => {
        it("returns length of lastFrameTime + timeStep when time values are integers", () => {
            const firstFrameTime = 0;
            const lastFrameTime = 10;
            const timeStep = 1;

            const maxNumChars = getMaxNumChars(
                firstFrameTime,
                lastFrameTime,
                timeStep
            );

            expect(maxNumChars).toBe("11".length);
        });

        it("returns length of lastFrameTime + timeStep when time values are floats", () => {
            const firstFrameTime = 0.1;
            const lastFrameTime = 44.1;
            const timeStep = 0.8;

            const maxNumChars = getMaxNumChars(
                firstFrameTime,
                lastFrameTime,
                timeStep
            );

            expect(maxNumChars).toBe("44.9".length);
        });

        it("returns length of lastFrameTime + timeStep when time values are lengthy floats that need rounding at the end", () => {
            const firstFrameTime = 0.1;
            const lastFrameTime = 44.10006;
            const timeStep = 0.0003;

            const maxNumChars = getMaxNumChars(
                firstFrameTime,
                lastFrameTime,
                timeStep
            );

            expect(maxNumChars).toBe("44.1".length);
        });

        it("returns length of firstFrameTime when it is longer than lastFrameTime + timeStep", () => {
            const firstFrameTime = 0.00001;
            const lastFrameTime = 44.1;
            const timeStep = 0.8;

            const maxNumChars = getMaxNumChars(
                firstFrameTime,
                lastFrameTime,
                timeStep
            );

            expect(maxNumChars).toBe("0.00001".length);
        });
    });
    describe("getDisplayTimes", () => {
        it("returns default values when timeUnits doesn't exist", () => {
            const mockState: State = initialState;
            expect(mockState.metadata.timeUnits).toBe(null);

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).toEqual({
                roundedTime: 0,
                roundedLastFrameTime: 0,
                roundedTimeStep: 0,
                maxNumChars: 1,
            });
        });

        it("rounds current time, timeStep, and lastFrameTime", () => {
            const mockState: State = {
                ...initialState,
                selection: {
                    ...initialState.selection,
                    time: 3.0001,
                },
                metadata: {
                    ...initialState.metadata,
                    timeUnits: {
                        magnitude: 1,
                        name: "s",
                    },
                    timeStep: 0.100000000023,
                    lastFrameTime: 15.0001,
                    firstFrameTime: 0.1000000001,
                },
            };

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).toEqual({
                roundedTime: 3,
                roundedLastFrameTime: 15,
                roundedTimeStep: 0.1,
                maxNumChars: 4,
            });
        });

        it("shows correct values when timeUnits.magnitude is not 1", () => {
            const mockState: State = {
                ...initialState,
                selection: {
                    ...initialState.selection,
                    time: 3.0001,
                },
                metadata: {
                    ...initialState.metadata,
                    timeUnits: {
                        magnitude: 2,
                        name: "ns",
                    },
                    timeStep: 0.100000000023,
                    lastFrameTime: 15.0001,
                    firstFrameTime: 0.1000000001,
                },
            };

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).toEqual({
                roundedTime: 6,
                roundedLastFrameTime: 30,
                roundedTimeStep: 0.2,
                maxNumChars: 4,
            });
        });

        it("shows correct maxNumChars when firstFrameTime is very long", () => {
            const mockState: State = {
                ...initialState,
                selection: {
                    ...initialState.selection,
                    time: 3.0001,
                },
                metadata: {
                    ...initialState.metadata,
                    timeUnits: {
                        magnitude: 1,
                        name: "ns",
                    },
                    timeStep: 0.0800000000023,
                    lastFrameTime: 15.0001,
                    firstFrameTime: 0.000004000000001,
                },
            };

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).toEqual({
                roundedTime: 3,
                roundedLastFrameTime: 15,
                roundedTimeStep: 0.08,
                maxNumChars: "0.000004".length,
            });
        });
    });
});
