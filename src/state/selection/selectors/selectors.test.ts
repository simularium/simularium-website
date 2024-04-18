import { initialState } from "../../index";
import { State } from "../../types";
import { getHighlightedAgents, getAgentsToHide } from ".";
import { AgentRenderingCheckboxMap } from "../types";
const mockUIDisplayData = [
    {
        name: "agent_with_two_states",
        displayStates: [
            {
                name: "state1",
                id: "state1",
            },
            {
                name: "state2",
                id: "state2",
            },
        ],
    },
    {
        name: "agent_with_unmodified_state",
        displayStates: [
            {
                name: "<unmodified>",
                id: "",
            },
            {
                name: "state1",
                id: "state1",
            },
        ],
    },

    {
        name: "agent_with_no_states",
        displayStates: [],
    },
];

const mockState: State = {
    ...initialState,
    trajectory: {
        ...initialState.trajectory,
        agentUiNames: mockUIDisplayData,
    },
};

describe("selection composed selectors", () => {
    describe("getHighlightedAgents", () => {
        it("returns an array of agent names ignoring state tags that aren't in the original data", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent_with_two_states: ["state1", "not a real state"],
                    },
                },
            };
            const highlightedNames = getHighlightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([
                { name: "agent_with_two_states", tags: ["state1"] },
            ]);
        });
        it("returns an array of agent names when a highlighted agent has no display states but has a tag", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent_with_no_states: ["agent_with_no_states"],
                    },
                },
            };
            const highlightedNames = getHighlightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([
                { name: "agent_with_no_states", tags: [] },
            ]);
        });
        it("returns an empty array when the agent has no display states and no tags", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent_with_no_states: [],
                    },
                },
            };
            const highlightedNames = getHighlightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([]);
        });
        it("returns an array of agent names and tags, including an unmodified tag if present", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent_with_unmodified_state: ["state1", ""],
                    },
                },
            };
            const highlightedNames = getHighlightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([
                {
                    name: "agent_with_unmodified_state",
                    tags: ["", "state1"],
                },
            ]);
        });
        it("only returns names included in the display data from the backend", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: { agent1: ["blah"] },
                },
            };
            const highlightedNames = getHighlightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([]);
        });
    });
    describe("getAgentsToHide", () => {
        // initially all agents and children are on
        const init = <AgentRenderingCheckboxMap>{};
        const initialVisibilityMap = mockUIDisplayData.reduce((acc, cur) => {
            if (cur.displayStates.length) {
                acc[cur.name] = cur.displayStates.map((state) => state.id);
            } else {
                acc[cur.name] = [cur.name];
            }
            return acc;
        }, init);

        it("for each agent in the visibility map: it returns state tags that are no included, and therefore not visible", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        ...initialVisibilityMap,
                        agent_with_two_states: ["state1"],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([
                { name: "agent_with_two_states", tags: ["state2"] },
            ]);
        });
        it("returns an empty array if all agents and their states are visible", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        agent_with_two_states: ["state1", "state2"],
                        agent_with_unmodified_state: ["", "state1"],
                        agent_with_no_states: ["agent_with_no_states"],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([]);
        });
        it("does not include an agent in the return array if the agent has no display states and is visible", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        ...initialVisibilityMap,
                        agent_with_no_states: ["agent_with_no_states"],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([]);
        });
        it("does include an agent in the return array if the agent has no display states and is hidden", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        ...initialVisibilityMap,
                        agent_with_no_states: [],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([
                { name: "agent_with_no_states", tags: [] },
            ]);
        });
        it("does not include an agent in the return array if the agent is not in the agentVisibilityMap", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        ...initialVisibilityMap,
                        agent1: ["state1"],
                        agent_with_two_states: ["state1"],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([
                { name: "agent_with_two_states", tags: ["state2"] },
            ]);
        });
    });
});
