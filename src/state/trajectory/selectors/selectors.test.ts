import { initialState } from "../../index";
import { State } from "../../types";

import { getIsNetworkedFile, getUiDisplayDataTree } from ".";

describe("trajectory composed selectors", () => {
    describe("getIsNetworkedFile", () => {
        it("returns false if there is no file name", () => {
            expect(getIsNetworkedFile(initialState)).toBe(false);
        });
        it("returns false if the file name is not found in our list of networked trajectories", () => {
            const state: State = {
                ...initialState,
                trajectory: {
                    ...initialState.trajectory,
                    simulariumFile: {
                        name: "Made-up Trajectory",
                        data: [1, 2, 3],
                        lastModified: 2021,
                    },
                },
            };
            expect(getIsNetworkedFile(state)).toBe(false);
        });
        it("returns true if the file name is found in our list of trajectories and has a title", () => {
            const state: State = {
                ...initialState,
                trajectory: {
                    ...initialState.trajectory,
                    simulariumFile: {
                        name: "endocytosis.simularium",
                        data: [1, 2, 3],
                        title: "Endocytosis",
                    },
                },
            };
            expect(getIsNetworkedFile(state)).toBe(true);
        });
    });

    describe("getUiDisplayDataTree", () => {
        it("returns an empty array if ui display data is empty", () => {
            expect(getUiDisplayDataTree(initialState)).toStrictEqual([]);
        });
        it("correctly maps agent display info to an array of display data", () => {
            const state: State = {
                ...initialState,
                trajectory: {
                    ...initialState.trajectory,
                    agentUiNames: [
                        {
                            name: "agent1",
                            displayStates: [],
                        },
                        {
                            name: "agent2",
                            displayStates: [
                                {
                                    name: "state1",
                                    id: "state1_id",
                                },
                                {
                                    name: "state2",
                                    id: "state2_id",
                                },
                            ],
                        },
                    ],
                },
            };

            const expected = [
                {
                    title: "agent1",
                    key: "agent1",
                    children: [],
                },
                {
                    title: "agent2",
                    key: "agent2",
                    children: [
                        {
                            label: "<unmodified>",
                            value: "",
                        },
                        {
                            label: "state1",
                            value: "state1_id",
                        },
                        {
                            label: "state2",
                            value: "state2_id",
                        },
                    ],
                },
            ];

            expect(getUiDisplayDataTree(state)).toStrictEqual(expected);
        });
    });
});
