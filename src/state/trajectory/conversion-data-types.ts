export enum AvailableEngines {
    Cytosim = "cytosim",
    CellPack = "cellPACK",
    Smoldyn = "Smoldyn",
    SpringSalad = "SpringSaLaD",
}

export interface CustomType {
    "python::module": string;
    "python::object": string;
    parameters: CustomParameters;
}

export interface CustomTypeDownload {
    [key: string]: CustomType;
}

export interface BaseType {
    isBaseType: true;
    id: string;
    data: string;
    match: string;
}

export interface CustomParameters {
    name: string;
    data_type: string;
    description: string;
    required: boolean;
    help: string;
    options?: string[];
}

export type TemplateMap = {
    [key: string]: BaseType | CustomType;
};

export interface Template {
    [key: string]: CustomType;
}
export type ExtensionMap = {
    [key in AvailableEngines]: string;
};
