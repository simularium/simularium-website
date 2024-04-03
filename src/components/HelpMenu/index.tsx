import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";

import { TUTORIAL_PATHNAME } from "../../routes";
import {
    FORUM_URL,
    FORUM_BUG_REPORT_URL,
    GITHUB_URL,
    ISSUE_URL,
} from "../../constants";
import { DownArrow } from "../Icons";
import VersionModal from "../VersionModal";
import NavButton from "../NavButton";

import styles from "./style.css";

import VersionModal from "../VersionModal";

const HelpMenu = (): JSX.Element => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const location = useLocation();
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
            label: "Submit issue",
            popupClassName: styles.submenu,
            popupOffset: [-0.45, -4],
            children: [
                {
                    key: "via-github",
                    label: (
                        <a
                            href={ISSUE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
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
            ],
        },
        {
            key: "version",
            label: (
                <a
                    onClick={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    Version info
                </a>
            ),
        },
    ];

    return (
        <>
            <Dropdown menu={{ items, theme: "dark", className: styles.menu }}>
                <NavButton
                    titleText={"Help "}
                    icon={DownArrow}
                    buttonType="secondary"
                />
            </Dropdown>
            {modalVisible && <VersionModal setModalVisible={setModalVisible} />}
        </>
    );
};

export default HelpMenu;
