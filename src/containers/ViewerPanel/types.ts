export interface DisplayTimes {
    roundedTime: number;
    roundedLastFrameTime: number;
    roundedTimeStep: number;
    maxNumChars: number;
}

export enum PlaybackControlsDisplay {
    Full = "Full",
    Min = "Min",
    BottomOnly = "BottomOnly",
}

export enum CameraControlsDisplay {
    Full = "Full",
    Min = "Min",
    None = "None",
}
