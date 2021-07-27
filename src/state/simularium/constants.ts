import { makeConstant } from "../util";
const BRANCH_NAME = "simularium";
const makeSimulariumConstant = (constant: string) =>
    makeConstant(BRANCH_NAME, constant);

export const SET_SIMULARIUM_CONTROLLER = makeSimulariumConstant(
    "set-sim-controller"
);
