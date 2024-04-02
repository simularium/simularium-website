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
