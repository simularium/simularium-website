import {
    getSelectAllVisibilityMap,
    getSelectNoneVisibilityMap,
    getIsSharedCheckboxIndeterminate,
} from "./selectors";

const mockUiDisplayData = [
    {
        title: "Macrophage",
        key: "Macrophage",
        children: [
            {
                label: "<unmodified>",
                value: "",
            },
            {
                label: "G0/G1 phase",
                value: "G0/G1 phase",
            },
        ],
    },
    {
        title: "Neutrophil",
        key: "Neutrophil",
        children: [
            {
                label: "<unmodified>",
                value: "",
            },
            {
                label: "G0/G1 phase",
                value: "G0/G1 phase",
            },
        ],
    },
    {
        title: "Dendritic cell",
        key: "Dendritic cell",
        children: [],
    },
];

describe("ModelPanel selectors", () => {
    describe("getSelectAllVisibilityMap", () => {
        it("Returns an agent visibility map with all possible states", () => {
            const result = getSelectAllVisibilityMap.resultFunc(
                mockUiDisplayData
            );
            const expected = {
                Macrophage: ["", "G0/G1 phase"],
                Neutrophil: ["", "G0/G1 phase"],
                "Dendritic cell": ["Dendritic cell"],
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getSelectNoneVisibilityMap", () => {
        it("Returns an agent visibility map with none of the possible states", () => {
            const result = getSelectNoneVisibilityMap.resultFunc(
                mockUiDisplayData
            );
            const expected = {
                Macrophage: [],
                Neutrophil: [],
                "Dendritic cell": [],
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("getIsSharedCheckboxIndeterminate", () => {
        it("Returns true if an agent has children in indeterminate state", () => {
            const mockAgentVisibilityMap = {
                Macrophage: [""],
                Neutrophil: [],
                "Dendritic cell": [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns true if one agent with display states is invisible but all states of the other agents are visible", () => {
            const mockAgentVisibilityMap = {
                Macrophage: ["", "G0/G1 phase"],
                Neutrophil: [],
                "Dendritic cell": ["Dendritic cell"],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns true if one agent without display states is invisible but all states of the other agents are visible", () => {
            const mockAgentVisibilityMap = {
                Macrophage: ["", "G0/G1 phase"],
                Neutrophil: ["", "G0/G1 phase"],
                "Dendritic cell": [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(true);
        });
        it("Returns false if all states of all agents are visible", () => {
            const mockAgentVisibilityMap = {
                Macrophage: ["", "G0/G1 phase"],
                Neutrophil: ["", "G0/G1 phase"],
                "Dendritic cell": ["Dendritic cell"],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
        it("Returns false if all states of all agents are invisible", () => {
            const mockAgentVisibilityMap = {
                Macrophage: [],
                Neutrophil: [],
                "Dendritic cell": [],
            };
            const result = getIsSharedCheckboxIndeterminate.resultFunc(
                mockUiDisplayData,
                mockAgentVisibilityMap
            );
            expect(result).toBe(false);
        });
    });
});
