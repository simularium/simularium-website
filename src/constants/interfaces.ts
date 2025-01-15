import { SelectionEntry } from "@aics/simularium-viewer";

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

export enum ButtonClass {
    Primary = "primary-button",
    Secondary = "secondary-button",
    Action = "action-button",
}

export enum IconGlyphs {
    StarEmpty = "star-empty-icon",
    StarDashed = "star-dashed-icon",
    StarFull = "star-full-icon",
    StepBack = "step-back-icon",
    StepForward = "step-forward-icon",
    Loop = "looping-icon",
    Rotate = "rotate-icon",
    Pan = "pan-icon",
    Focus = "focus-icon",
    Orthographic = "orthographic-icon",
    Perspective = "perspective-icon",
    Reset = "reset-icon",
    Close = "close-icon",
}

export enum ConversionError {
    SERVER_ERROR = "serverError",
    FILE_TYPE_ERROR = "fileTypeError",
    FILE_SIZE_ERROR = "fileSizeError",
    NO_ERROR = "noError",
}
export interface Vector3D {
    x: number;
    y: number;
    z: number;
}
export interface AgentMetadata {
    uniqueId: number;
    agentType: number;
    position: Vector3D;
    rotation: Vector3D;
    radius: number;
}

export interface MetadataDisplay {
    label: JSX.Element;
    value: () => JSX.Element | string;
}

export interface ColorChange {
    agent: SelectionEntry;
    color: string;
}

export enum DropdownState {
    OPEN = "open",
    CLOSED = "closed",
    FORCED_OPEN = "forced_open",
}
