export interface TrajectoryDisplayData {
    modelName: string;
    id: string;
    title: string;
    subtitle?: string;
    version?: string;
    totalSimulatedTime: string;
    authors: string;
    publication: {
        title: string;
        journal: string;
        year: number;
        url: string;
    };
    description: string;
    code?: string;
    legalese?: string;
    imageFile: string;
    gifFile: string;
}

export interface VisualGlossaryItem {
    label: string;
    description: string;
    bulletItems?: string[];
}

export type TooltipPlacement =
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";

export enum ButtonType {
    Primary = "primary-button",
    Secondary = "secondary-button",
    Action = "action-button",
}

export enum IconGlyphs {
    StarEmpty = "icon-moon anticon star-empty-icon",
    StarDashed = "icon-moon anticon star-dashed-icon",
    StarFull = "icon-moon anticon star-full-icon",
    StepBack = "icon-moon anticon step-back-icon",
    StepForward = "icon-moon anticon step-forward-icon",
    Loop = "icon-moon anticon looping-icon",
    Rotate = "icon-moon anticon rotate-icon",
    Pan = "icon-moon anticon pan-icon",
    Focus = "icon-moon anticon focus-icon",
    Orthographic = "icon-moon anticon orthographic-icon",
    Perspective = "icon-moon anticon perspective-icon",
    Reset = "icon-moon anticon reset-icon",
    Close = "icon-moon anticon close-icon",
}
