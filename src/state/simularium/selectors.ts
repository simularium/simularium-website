import { State } from "../types";

// BASIC SELECTORS
export const getSimulariumController = (state: State) =>
    state.simularium.simulariumController;

// COMPOSED SELECTORS
