import { initialState } from "../../index";
import { State } from "../../types";
import { getHighLightedAgents, getAgentsToHide } from ".";
const mockUIDisplayData = [
    {
        name: "agent1",
        displayStates: [
            {
                name: "state1",
                id: "state1",
            },
        ],
    },
    {
        name: "agent2",
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
        name: "agent3",
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
    describe("getHighLightedNames", () => {
        it("returns an array of agent names ignoring state tags", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent1: ["state1", "hl-agent2-state2"],
                    },
                },
            };
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([
                { name: "agent1", tags: ["state1"] },
            ]);
        });
        it("returns an array of agent names when a highlighted agent has no display states but has a tag", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent3: ["agent3"],
                    },
                },
            };
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([{ name: "agent3", tags: [] }]);
        });
        it("returns an empty array when the agent has no display states and no tags", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent3: [],
                    },
                },
            };
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([]);
        });
        it("returns an array of agent names and tags, including an unmodified tag if present", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentHighlightMap: {
                        agent2: ["", "state1"],
                    },
                },
            };
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([
                { name: "agent2", tags: ["state1", ""] },
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
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([]);
        });
    });
    describe("getAgentsToHide", () => {
        it("returns an array of agent names and states that are not currently visible", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        agent1: ["agent1", "v-agent2-state2"],
                        agent2: [""],
                        agent3: [],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([
                { name: "agent1", tags: ["state1", ""] },
                { name: "agent2", tags: ["state1", "state2"] },
                { name: "agent3", tags: [] },
            ]);
        });
        it("returns an empty array if all agents and their states are visible", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        agent1: ["state1", ""],
                        agent2: ["state1", "state2", ""],
                        agent3: [""],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([]);
        });
        it("does not include an agent in the return array if the agent has no display states but has a state that is supposed to be visible", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        agent1: ["state1"],
                        agent2: ["state1", "state2"],
                        agent3: ["made-up-state"],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([
                { name: "agent1", tags: [""] },
                { name: "agent2", tags: [""] },
            ]);
        });
        it("does not include an agent in the return array if the agent is not in the agentVisibilityMap for some reason", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    agentVisibilityMap: {
                        agent1: ["state1"],
                        agent2: ["state1", "state2"],
                    },
                },
            };
            const agentsToHide = getAgentsToHide(stateWithSelection);
            expect(agentsToHide).toBeInstanceOf(Array);
            expect(agentsToHide).toEqual([
                { name: "agent1", tags: [""] },
                { name: "agent2", tags: [""] },
            ]);
        });
    });
});
