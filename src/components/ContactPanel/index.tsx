import React from "react";

import { CONTACT_FORM_URL } from "../../constants";
import ContentPagePanel from "../ContentPagePanel";

import styles from "./style.css";

interface ContactPanelProps {
    isDark?: boolean;
}

const ContactPanel = ({ isDark }: ContactPanelProps): JSX.Element => {
    return (
        <ContentPagePanel isDark={isDark}>
            <h2 className={styles.headerSpacing}>Contact us</h2>
            <p>
                We are collecting user feedback to improve this application. To
                find tutorials, seek technical support, report bugs or request
                features, use the Help menu found in the upper right corner of
                this website. Please <a href={CONTACT_FORM_URL}> contact us</a>{" "}
                if you have ideas for potential collaborations, or want to be
                alerted to major updates.
            </p>
        </ContentPagePanel>
    );
};

export default ContactPanel;
