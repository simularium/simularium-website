import { initialState } from "../../index";
import { State } from "../../types";
import { TrajectoryStateBranch } from "../types";

import { getIsNetworkedFile } from ".";

describe("trajectory composed selectors", () => {
    describe("getIsNetworkedFile", () => {
        it("returns false if there is no file name", () => {
            const mockTrajectory: TrajectoryStateBranch = {
                ...initialState.trajectory,
                simulariumFile: {
                    name: "",
                    data: [1, 2, 3],
                    lastModified: 2021,
                },
            };
            const mockState: State = {
                ...initialState,
                trajectory: mockTrajectory,
            };
            expect(getIsNetworkedFile(mockState)).toBe(false);
        });
        it("returns false if the file name is not found in our list of networked trajectories", () => {
            const mockTrajectory: TrajectoryStateBranch = {
                ...initialState.trajectory,
                simulariumFile: {
                    name: "Made-up Trajectory",
                    data: [1, 2, 3],
                    lastModified: 2021,
                },
            };
            const mockState: State = {
                ...initialState,
                trajectory: mockTrajectory,
            };
            expect(getIsNetworkedFile(mockState)).toBe(false);
        });
        it("returns true if the file name is found in our list of trajectories and has a title", () => {
            const mockTrajectory: TrajectoryStateBranch = {
                ...initialState.trajectory,
                simulariumFile: {
                    name: "endocytosis.simularium",
                    data: [1, 2, 3],
                    title: "Endocytosis",
                },
            };
            const mockState: State = {
                ...initialState,
                trajectory: mockTrajectory,
            };
            expect(getIsNetworkedFile(mockState)).toBe(true);
        });
    });

    describe("getUiDisplayDataTree", () => {});
});
