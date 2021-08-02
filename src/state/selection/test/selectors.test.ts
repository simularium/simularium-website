import { initialState } from "../../index";
import { State } from "../../types";
import { getHightLightedAgents, getAgentsToHide } from "../selectors";
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
];

const mockState: State = {
    ...initialState,
    trajectory: {
        ...initialState.trajectory,
        agentUiNames: mockUIDisplayData,
    },
};

describe("selection composed selectors", () => {
    describe("getHightLightedNames", () => {
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
            const highlightedNames = getHightLightedAgents(stateWithSelection);
            expect(highlightedNames).toBeInstanceOf(Array);
            expect(highlightedNames).toEqual([
                { name: "agent1", tags: ["state1"] },
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
            const highlightedNames = getHightLightedAgents(stateWithSelection);
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
