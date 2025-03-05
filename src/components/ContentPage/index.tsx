import * as React from "react";
import { Divider, Layout } from "antd";
import Footer from "../Footer";
import ContactPanel from "../ContactPanel";

import styles from "./style.css";

const { Content } = Layout;

interface ContentPageProps {
    children: React.ReactNode;
    className?: string;
}

const ContentPage: React.FC<ContentPageProps> = ({
    children,
    className = "",
}) => {
    return (
        <React.Fragment>
            <Content className={`${styles.pageContent} ${className}`}>
                {children}
            </Content>
            <ContactPanel />
            <Divider className={styles.divider} />
            <Footer />
        </React.Fragment>
    );
};

export default ContentPage;
