import {
    ISimulariumFile,
    SimulariumController,
} from "@aics/simularium-viewer/type-declarations";

export interface TrajectoryStateBranch {
    [key: string]: any;
}

export interface ReceiveAction {
    payload: TrajectoryStateBranch;
    type: string;
}

export interface RequestAction {
    type: string;
}

export interface ClearSimFileDataAction {
    payload: {
        newFile: boolean;
    };
    type: string;
}

export interface RequestCachedPlotAction {
    payload: { url: string };
    type: string;
}

export interface RequestNetworkFileAction {
    payload: NetworkedSimFile;
    type: string;
    controller?: SimulariumController;
}

export interface RequestLocalFileAction {
    payload: LocalSimFile;
    type: string;
    controller?: SimulariumController;
}

export interface LoadViaUrlAction {
    payload: string;
    type: string;
    controller?: SimulariumController;
    fileId?: string;
}

export interface LocalSimFile {
    name: string;
    data: ISimulariumFile;
    lastModified: number;
    geoAssets?: { [key: string]: string };
}

export interface NetworkedSimFile {
    name: string;
    title: string;
}
export const isLocalFileInterface = (file: any): file is LocalSimFile =>
    !!file.lastModified;

export const isNetworkSimFileInterface = (
    file: any
): file is NetworkedSimFile => !!file.title;

export interface TimeUnits {
    magnitude: number;
    name: string;
}

export interface SetUrlParamsAction {
    type: string;
}
