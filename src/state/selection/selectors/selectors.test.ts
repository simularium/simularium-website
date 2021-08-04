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
                    highlightedAgentKeys: {
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
        it("returns an array of agent names when a highlighted agent has no display states", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    highlightedAgentKeys: {
                        agent3: ["agent3"],
                    },
                },
            };
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([{ name: "agent3", tags: [] }]);
        });
        it("returns an array of agent names and tags, including an unmodified tag if present", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    highlightedAgentKeys: {
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
                    highlightedAgentKeys: { agent1: ["blah"] },
                },
            };
            const highlightedNames = getHighLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([]);
        });
    });
    describe("getAgentNamesToHide", () => {
        it("returns an array of agent names that are not currently selected", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    visibleAgentKeys: { agent1: ["agent1", "v-agent2-state2"] },
                },
            };
            const hiddenNames = getAgentsToHide(stateWithSelection);
            expect(hiddenNames).toBeInstanceOf(Array);
            expect(hiddenNames).toEqual([
                { name: "agent1", tags: ["state1", ""] },
            ]);
        });
    });
});
