import { getCurrentUIData } from ".";
import { initialState } from "..";
import { ColorSettings } from "../selection/types";

describe("getCurrentUIData", () => {
    it("returns empty array if default UI data has not been entered yet", () => {
        expect(getCurrentUIData(initialState)).toEqual([]);
    });
    it("returns selectedUIDisplayData if colorSetting is equal to ColorSettings.UserSelected", () => {
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
                    currentColorSettings: ColorSettings.UserSelected,
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

    it("returns defaultUIData if colorSetting is euqal to ColorSettings.Default", () => {
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
                    currentColorSettings: ColorSettings.Default,
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
