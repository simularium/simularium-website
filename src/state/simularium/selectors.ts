import { State } from "../types";

// BASIC SELECTORS
export const getSimulariumController = (state: State) =>
    state.trajectory.simulariumController;

// COMPOSED SELECTORS
