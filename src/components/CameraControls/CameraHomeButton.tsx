import React from "react";
import ViewportButton from "../ViewportButton";
import { getIconGlyphClasses } from "../../util";
import { IconGlyphs } from "../../constants/interfaces";

interface CameraHomeButtonProps {
    resetCamera: () => void;
}

export const CameraHomeButton: React.FC<CameraHomeButtonProps> = ({
    resetCamera,
}: CameraHomeButtonProps) => {
    return (
        <ViewportButton
            tooltipText={"Home view (H)"}
            tooltipPlacement="left"
            icon={getIconGlyphClasses(IconGlyphs.Reset)}
            clickHandler={resetCamera}
        />
    );
};

export default CameraHomeButton;
