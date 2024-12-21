import { getCurrentUIData, areDefaultUISettingsApplied } from ".";
import { initialState } from "..";
import { ColorSetting } from "../selection/types";

describe("getCurrentUIData", () => {
    it("returns empty array if default UI data has not been entered yet", () => {
        expect(getCurrentUIData(initialState)).toEqual([]);
        1;
    });
    it("returns selectedUIDisplayData if colorSetting is equal to ColorSetting.UserSelected", () => {
        expect(
            getCurrentUIData({
                ...initialState,
                trajectory: {
                    ...initialState.trajectory,
                    defaultUIData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                    ],
                },
                selection: {
                    ...initialState.selection,
                    currentColorSetting: ColorSetting.UserSelected,
                    selectedUIDisplayData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#000",
                        },
                    ],
                },
            })
        ).toEqual([
            {
                name: "agent1",
                displayStates: [],
                color: "#000",
            },
        ]);
    });

    it("returns defaultUIData if colorSetting is euqal to ColorSetting.Default", () => {
        expect(
            getCurrentUIData({
                ...initialState,
                trajectory: {
                    ...initialState.trajectory,
                    defaultUIData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                    ],
                },
                selection: {
                    ...initialState.selection,
                    currentColorSetting: ColorSetting.Default,
                    selectedUIDisplayData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#000",
                        },
                    ],
                },
            })
        ).toEqual([
            {
                name: "agent1",
                displayStates: [],
                color: "#bbbbbb",
            },
        ]);
    });
});

describe("areDefaultUISettingsApplied", () => {
    it("returns false if selectedUIDisplayData contains selections and selectedUIDisplayData and defaultUIData are not equal", () => {
        expect(
            areDefaultUISettingsApplied({
                ...initialState,
                trajectory: {
                    defaultUIData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                    ],
                },
                selection: {
                    ...initialState.selection,
                    selectedUIDisplayData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#000",
                        },
                    ],
                },
            })
        ).toBe(false);
    });
    it("returns true if selectedUIDisplayData contains no selections", () => {
        expect(
            areDefaultUISettingsApplied({
                ...initialState,
                trajectory: {
                    defaultUIData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                    ],
                },
                selection: {
                    selectedUIDisplayData: [],
                },
            })
        ).toBe(true);
    });
    it("returns true if selectedUIDisplayData and defaultUIData are equal", () => {
        expect(
            areDefaultUISettingsApplied({
                ...initialState,
                trajectory: {
                    defaultUIData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                    ],
                },
                selection: {
                    selectedUIDisplayData: [
                        {
                            name: "agent1",
                            displayStates: [],
                            color: "#bbbbbb",
                        },
                    ],
                },
            })
        ).toBe(true);
    });
});
