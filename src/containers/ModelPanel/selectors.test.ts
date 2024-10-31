import { initialState, State } from "../../state";
import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
    getUiDisplayDataTree,
} from "./selectors";

const mockUiDisplayData = [
    {
        title: "agentWithChildren1",
        key: "agentWithChildren1",
        color: "",
        children: [
            {
                label: "<unmodified>",
                value: "",
                color: "",
            },
            {
                label: "state1",
                value: "state1",
                color: "",
            },
        ],
    },
    {
        title: "agentWithChildren2",
        key: "agentWithChildren2",
        color: "",
        children: [
            {
                label: "<unmodified>",
                value: "",
                color: "",
            },
            {
                label: "state1",
                value: "state1",
                color: "",
            },
        ],
    },
    {
        title: "agentWithoutChildren",
        key: "agentWithoutChildren",
        color: "",
        children: [],
    },
];

describe("ModelPanel selectors", () => {
    describe("getSelectAllVisibilityMap", () => {
        it("Returns an agent visibility map with all possible states", () => {
            const result =
                getSelectAllVisibilityMap.resultFunc(mockUiDisplayData);
            const expected = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: ["", "state1"],
                agentWithoutChildren: ["agentWithoutChildren"],
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getSelectNoneVisibilityMap", () => {
        it("Returns an agent visibility map with none of the possible states", () => {
            const result =
                getSelectNoneVisibilityMap.resultFunc(mockUiDisplayData);
            const expected = {
                agentWithChildren1: [],
                agentWithChildren2: [],
                agentWithoutChildren: [],
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getIsSharedCheckboxIndeterminate", () => {
        it("Returns true if an agent has children in indeterminate state", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: [""],
                agentWithChildren2: [],
                agentWithoutChildren: [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns true if one agent with display states is invisible but all states of the other agents are visible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: [],
                agentWithoutChildren: ["agentWithoutChildren"],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns true if one agent without display states is invisible but all states of the other agents are visible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: ["", "state1"],
                agentWithoutChildren: [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns false if all states of all agents are visible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: ["", "state1"],
                agentWithChildren2: ["", "state1"],
                agentWithoutChildren: ["agentWithoutChildren"],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Returns false if all states of all agents are invisible", () => {
            const mockAgentVisibilityMap = {
                agentWithChildren1: [],
                agentWithChildren2: [],
                agentWithoutChildren: [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Returns false if no visibility information is supplied", () => {
            const mockAgentVisibilityMap = {};
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Instead of crashing, skips a check for an agent if it is missing from agentVisibilityMap for some reason", () => {
            // No need to print out the console.warn from getIsSharedCheckboxIndeterminate
            // in the Jest test results
            jest.spyOn(global.console, "warn").mockImplementation(() =>
                jest.fn()
            );

            const mockAgentVisibilityMap = {
                agentWithChildren1: [],
                agentWithChildren2: [],
                // Missing "agentWithoutChildren"
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
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
