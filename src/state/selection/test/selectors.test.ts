import { expect } from "chai";
import { initialState } from "../../index";
import { State } from "../../types";
import { getHightLightedNames, getHightLightedTags } from "../selectors";
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
    metadata: {
        ...initialState.metadata,
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
                    highlightedAgentKeys: ["agent1", "hl-agent2-state2"],
                },
            };
            const highlightedNames = getHightLightedNames(stateWithSelection);
            expect(highlightedNames).to.be.a("array");
            expect(highlightedNames).to.deep.equal(["agent1"]);
        });
        it("only returns names included in the display data from the backend", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    highlightedAgentKeys: ["blah"],
                },
            };
            const highlightedNames = getHightLightedNames(stateWithSelection);
            expect(highlightedNames).to.be.a("array");
            expect(highlightedNames).to.deep.equal([]);
        });
    });
    describe("getHightLightedTags", () => {
        it("returns an array of agent tag ids", () => {
            const stateWithSelection = {
                ...mockState,
                selection: {
                    ...mockState.selection,
                    highlightedAgentKeys: ["agent1", "hl-agent2-state2"],
                },
            };
            const highlightedNames = getHightLightedTags(stateWithSelection);
            expect(highlightedNames).to.be.a("array");
            expect(highlightedNames).to.deep.equal(["state2"]);
        });
    });
});
