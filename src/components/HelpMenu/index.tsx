import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { MenuProps } from "antd";

import { TUTORIAL_PATHNAME } from "../../routes";
import {
    FORUM_BUG_REPORT_URL,
    FORUM_URL,
    GITHUB_URL,
    ISSUE_URL,
} from "../../constants";
import { ButtonClass } from "../../constants/interfaces";
import { DownArrow } from "../Icons";
import VersionModal from "../VersionModal";
import AccessibleDropdown from "../AccessibleDropdown.tsx";

import styles from "./style.css";

interface HelpMenuProps {
    containerRef: React.RefObject<HTMLElement>;
    preventGlobalHotkeys: any;
}

const HelpMenu = ({
    containerRef,
    preventGlobalHotkeys,
}: HelpMenuProps): JSX.Element => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const subMenuTriggerRef = useRef<HTMLAnchorElement>(null);

    const subMenuItems: MenuProps["items"] = [
        {
            key: "via-github",
            label: (
                <a href={ISSUE_URL} target="_blank" rel="noopener noreferrer">
                    via GitHub (preferred)
                </a>
            ),
        },
        {
            key: "via-forum",
            label: (
                <a
                    href={FORUM_BUG_REPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    via Forum (for non-GitHub users)
                </a>
            ),
        },
    ];

    const tutorialLink =
        location.pathname === "/viewer" ? (
            <Link
                to={TUTORIAL_PATHNAME}
                target="_blank"
                rel="noopener noreferrer"
            >
                Quick start
            </Link>
        ) : (
            <Link to={TUTORIAL_PATHNAME}>Quick start</Link>
        );

    const items: MenuProps["items"] = [
        {
            key: "tutorial",
            label: tutorialLink,
        },
        {
            key: "forum",
            label: (
                <a href={FORUM_URL} target="_blank" rel="noopener noreferrer">
                    Forum
                </a>
            ),
        },
        {
            key: "github",
            label: (
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
            ),
        },
        {
            key: "submit-issue",
            label: (
                <a ref={subMenuTriggerRef} id={"submenu-trigger"} href="#">
                    Submit an issue
                </a>
            ),
        },
        {
            key: "version",
            label: (
                <a
                    href="#" // <a> tag is not focusable without href
                    onClick={(e) => {
                        e.preventDefault();
                        setModalVisible(true);
                    }}
                >
                    Version info
                </a>
            ),
        },
    ];

    return (
        <div>
            <AccessibleDropdown
                containerRef={containerRef}
                preventGlobalHotkeys={preventGlobalHotkeys}
                items={items}
                className={styles.menu}
                buttonText={"Help "}
                buttonIcon={DownArrow}
                buttonType={ButtonClass.Secondary}
                subMenuTriggerRef={subMenuTriggerRef}
                submenuTriggerKey="submit-issue"
                subMenuItems={subMenuItems}
                subMenuClassName={styles.submitIssueSubmenu}
            />
            {modalVisible && (
                <VersionModal setModalVisible={() => setModalVisible(false)} />
            )}
        </div>
    );
};

export default HelpMenu;
