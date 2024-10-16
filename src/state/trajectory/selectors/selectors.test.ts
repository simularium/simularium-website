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
                    defaultUIData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                        {
                            name: "agent2",
                            color: "#aaaaaa",
                            displayStates: [
                                {
                                    name: "state1",
                                    id: "state1_id",
                                    color: "#000000",
                                },
                                {
                                    name: "state2",
                                    id: "state2_id",
                                    color: "#000000",
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
                    color: "#bbbbbb",
                },
                {
                    title: "agent2",
                    key: "agent2",
                    color: "#aaaaaa",
                    children: [
                        {
                            color: "#000000",
                            label: "state1",
                            value: "state1_id",
                        },
                        {
                            color: "#000000",
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
