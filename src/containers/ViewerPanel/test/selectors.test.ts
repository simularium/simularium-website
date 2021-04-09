import { expect } from "chai";

import { initialState } from "../../../state/index";
import { State } from "../../../state/types";
import { getDisplayTimes } from "../selectors";

describe("ViewerPanel selectors", () => {
    describe("getDisplayTimes", () => {
        it("returns default values when timeUnits doesn't exist", () => {
            const mockState: State = initialState;
            expect(mockState.metadata.timeUnits).to.equal(null);

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).to.deep.equal({
                roundedTime: 0,
                roundedLastFrameTime: 0,
                unitLabel: "s",
            });
        });

        it("rounds current time and lastFrameTime", () => {
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
                    lastFrameTime: 15.0001,
                },
            };

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).to.deep.equal({
                roundedTime: 3,
                roundedLastFrameTime: 15,
                unitLabel: "s",
            });
        });

        it("returns user-set non-second time unit", () => {
            const mockState: State = {
                ...initialState,
                selection: {
                    ...initialState.selection,
                    time: 3,
                },
                metadata: {
                    ...initialState.metadata,
                    timeUnits: {
                        magnitude: 1,
                        name: "ns",
                    },
                    lastFrameTime: 15,
                },
            };

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).to.deep.equal({
                roundedTime: 3,
                roundedLastFrameTime: 15,
                unitLabel: "ns",
            });
        });

        it("shows correct values and units when timeUnits.magnitude is not 1", () => {
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
                    lastFrameTime: 15.0001,
                },
            };

            const displayTimes = getDisplayTimes(mockState);

            expect(displayTimes).to.deep.equal({
                roundedTime: 6,
                roundedLastFrameTime: 30,
                unitLabel: "ns",
            });
        });
    });
});
