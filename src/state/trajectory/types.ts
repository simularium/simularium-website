import { ISimulariumFile, SimulariumController } from "@aics/simularium-viewer";
import {
    AvailableEngines,
    Template,
    TemplateMap,
} from "./conversion-data-types";
import {
    CONVERSION_NO_SERVER,
    CONVERSION_SERVER_LIVE,
    CONVERSION_ACTIVE,
    CONVERSION_INACTIVE,
} from "./constants";
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

export interface InitializeConversionAction {
    type: string;
}

export interface ReceiveFileToConvertAction {
    type: string;
    payload: { fileContents: string; fileName: string };
}

export interface SetConversionEngineAction {
    payload: AvailableEngines;
    type: string;
}

export interface ConvertFileAction {
    payload: { fileId: string };
    type: string;
}

export interface SetConversionTemplateData {
    payload: {
        engineType: AvailableEngines;
        template: Template;
        templateMap: TemplateMap;
    };
    type: string;
}

export interface SetConversionStatusAction {
    payload: { status: ConversionStatus };
    type: string;
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

export interface HealthCheckTimeout {
    [requestId: string]: NodeJS.Timeout;
}

export type ConversionStatus =
    | typeof CONVERSION_INACTIVE
    | typeof CONVERSION_NO_SERVER
    | typeof CONVERSION_SERVER_LIVE
    | typeof CONVERSION_ACTIVE;
