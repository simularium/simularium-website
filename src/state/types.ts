import { AxiosInstance } from "axios";
import { AnyAction } from "redux";

import { TrajectoryStateBranch } from "./trajectory/types";
import { SelectionStateBranch } from "./selection/types";
import { ViewerStateBranch } from "./viewer/types";
import { SimulariumStateBranch } from "./simularium/types";

export interface ActionDescription {
    accepts: (action: AnyAction) => boolean;
    perform: (state: any, action: any) => any;
}

export interface BatchedAction {
    type: string;
    batch: boolean;
    payload: AnyAction[];
}

export interface ReduxLogicDeps {
    action: AnyAction;
    baseApiUrl: string;
    plotDataUrl: string;
    httpClient: AxiosInstance;
    getState: () => State;
    ctx?: any;
}

export type ReduxLogicNextCb = (action: AnyAction) => void;

export interface State {
    trajectory: TrajectoryStateBranch;
    selection: SelectionStateBranch;
    viewer: ViewerStateBranch;
    simularium: SimulariumStateBranch;
}

export interface TypeToDescriptionMap {
    [propName: string]: ActionDescription;
}
