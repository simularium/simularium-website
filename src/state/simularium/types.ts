import { SimulariumController } from "@aics/simularium-viewer";

export interface SimulariumStateBranch {
    [key: string]: any;
}

export interface ReceiveAction {
    payload: SimulariumStateBranch;
    type: string;
}

export interface SetSimulariumControllerAction {
    payload: SimulariumController;
    type: string;
}
