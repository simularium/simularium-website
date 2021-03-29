import {
    SimulariumFileFormat,
    SimulariumController,
} from "@aics/simularium-viewer/type-declarations";
import {
    VIEWER_LOADING,
    VIEWER_ERROR,
    VIEWER_EMPTY,
    VIEWER_SUCCESS,
} from "./constants";

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

export interface LocalSimFile {
    name: string;
    data: SimulariumFileFormat;
    lastModified: number;
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

export interface SetSimulariumControllerAction {
    payload: SimulariumController;
    type: string;
}

type VIEWER_LOADING = typeof VIEWER_LOADING;
type VIEWER_ERROR = typeof VIEWER_ERROR;
type VIEWER_EMPTY = typeof VIEWER_EMPTY;
type VIEWER_SUCCESS = typeof VIEWER_SUCCESS;
export type ViewerStatus =
    | VIEWER_LOADING
    | VIEWER_ERROR
    | VIEWER_EMPTY
    | VIEWER_SUCCESS;

export interface SetViewerStatusAction {
    payload: ViewerStatusInfo;
    type: string;
}

export interface ViewerStatusInfo {
    htmlData?: string;
    errorMessage?: string;
    status: ViewerStatus;
}

export interface ViewerError {
    htmlData?: string;
    message: string;
}

export interface FrontEndError extends Error {
    htmlData?: string;
}
