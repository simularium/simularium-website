import {
    SimulariumFileFormat,
    SimulariumController,
} from "@aics/simularium-viewer/type-declarations";

export interface MetadataStateBranch {
    [key: string]: any;
}

export interface ReceiveAction {
    payload: MetadataStateBranch;
    type: string;
}

export interface RequestAction {
    type: string;
}

export interface LocalSimFile {
    name: string;
    data: SimulariumFileFormat;
}

export interface SetSimulariumControllerAction {
    payload: SimulariumController;
    type: string;
}
