export interface SimulariumStateBranch {
    [key: string]: any;
}

export interface ReceiveAction {
    payload: SimulariumStateBranch;
    type: string;
}
