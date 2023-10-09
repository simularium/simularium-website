import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { Dropdown, Button, MenuProps } from "antd";

import { TUTORIAL_PATHNAME } from "../../routes";
import { DownArrow } from "../Icons";
import {
    FORUM_URL,
    FORUM_BUG_REPORT_URL,
    GITHUB_URL,
    ISSUE_URL,
} from "../../constants";

import styles from "./style.css";

const HelpMenu = (): JSX.Element => {
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
    ];

    return (
        <Dropdown menu={{ items, theme: "dark", className: styles.menu }}>
            <Button onClick={(e) => e.preventDefault()} type="ghost">
                Help {DownArrow}
            </Button>
        </Dropdown>
    );
};

export default HelpMenu;
