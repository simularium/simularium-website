import React, { ReactNode } from "react";

interface FlexboxComponentProps {
    children: ReactNode;
    flexDirection: "row" | "column";
    className?: string;
    gap?: number;
    alignItems?: string;
    justifyContent?: string;
}

type IFlexboxComponentProps = Omit<FlexboxComponentProps, "flexDirection">;

const createFlexboxComponent = (
    flexDirection: "row" | "column",
    displayName: string
) => {
    const FlexboxUtility: React.FC<IFlexboxComponentProps> = ({
        children,
        className,
        gap = 0,
        alignItems = "stretch",
        justifyContent = "flex-start",
    }) => (
        <div
            className={className}
            style={{
                display: "flex",
                flexDirection: flexDirection,
                gap: `${gap}px`,
                alignItems,
                justifyContent,
            }}
        >
            {children}
        </div>
    );

    FlexboxUtility.displayName = displayName;
    return FlexboxUtility;
};

const VerticalFlexbox = createFlexboxComponent("column", "VerticalFlexbox");
const HorizontalFlexbox = createFlexboxComponent("row", "HorizontalFlexbox");

export { VerticalFlexbox, HorizontalFlexbox };
