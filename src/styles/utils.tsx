import React, { ReactNode } from "react";

interface VerticalFlexboxProps {
    children: ReactNode;
    className?: string;
    gap?: number;
    alignItems?: string;
    justifyContent?: string;
}

const VerticalFlexbox: React.FC<VerticalFlexboxProps> = ({
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
            flexDirection: "column",
            gap: `${gap}px`,
            alignItems: alignItems,
            justifyContent: justifyContent,
        }}
    >
        {children}
    </div>
);

export default VerticalFlexbox;
