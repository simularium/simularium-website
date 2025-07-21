import * as React from "react";
import { Divider, Layout } from "antd";
import Footer from "../Footer";
import ContactPanel from "../ContactPanel";

import styles from "./style.css";

const { Content } = Layout;

interface ContentPageProps {
    children: React.ReactNode;
    className?: string;
    contactPanelIsDark?: boolean;
}

const ContentPage: React.FC<ContentPageProps> = ({
    children,
    className = "",
    contactPanelIsDark = false,
}) => {
    return (
        <>
            <Content className={`${styles.pageContent} ${className}`}>
                {children}
            </Content>
            <ContactPanel isDark={contactPanelIsDark} />
            <Divider className={styles.divider} />
            <Footer />
        </>
    );
};

export default ContentPage;
