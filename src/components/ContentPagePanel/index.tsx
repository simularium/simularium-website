import * as React from "react";
import styles from "./style.css";

interface ContentPagePanelProps {
    children: React.ReactNode;
    isDark?: boolean;
    isWide?: boolean;
    id?: string;
    className?: string;
}

const ContentPagePanel: React.FC<ContentPagePanelProps> = ({
    children,
    isDark = false,
    isWide = false,
    id,
    className = "",
}) => {
    const panelClasses = `
    ${styles.panel} 
    ${isDark ? styles.darkSection : ""} 
    ${className}
  `;

    const innerClasses = `
    ${styles.panelInner}
    ${isWide ? styles.wide : ""}
  `;

    return (
        <div className={panelClasses} id={id}>
            <div className={innerClasses}>{children}</div>
        </div>
    );
};

export default ContentPagePanel;
