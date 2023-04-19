export enum AvailableEngines {
    Cytosim = "cytosim",
    CellPack = "cellPACK",
    Smoldyn = "Smoldyn",
    SpringSalad = "SpringSaLaD",
}

export interface BaseType {
    isBaseType: true;
    id: string;
    data: string;
    match: string;
}

export interface CustomParameter {
    name: string;
    data_type: string;
    description: string;
    required: boolean;
    help: string;
    options?: string[];
}

export interface CustomParameters {
    [key: string]: CustomParameter;
}

export interface CustomType {
    "python::module": string;
    "python::object": string;
    parameters: CustomParameters;
}

export type TemplateMap = {
    [key: string]: BaseType | CustomType;
};

export interface DownloadedCustomType {
    [key: string]: CustomType;
}

export interface DownloadedTemplate {
    [key: string]: CustomType;
}
