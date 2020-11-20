import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";

import { TUTORIAL_PATHNAME } from "../../routes";
import { DownArrow } from "../Icons";
import {
    CONTACT_FORM_URL,
    FORUM_URL,
    GITHUB_URL,
    ISSUE_URL,
} from "../../constants";

const styles = require("./style.css");

const HelpMenu: React.FunctionComponent<{}> = () => {
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
    const menu = (
        <Menu theme="dark" className={styles.menu}>
            <Menu.Item>{tutorialLink}</Menu.Item>
            <Menu.Item>
                <a href={FORUM_URL} target="_blank" rel="noopener noreferrer">
                    Forum
                </a>
            </Menu.Item>
            <Menu.Item>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
            </Menu.Item>
            <Menu.SubMenu
                title="Submit issue"
                popupClassName={styles.submenu}
                popupOffset={[-0.45, -4]}
            >
                <Menu.Item key="github">
                    <a
                        href={ISSUE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        via GitHub (preferred)
                    </a>
                </Menu.Item>
                <Menu.Item key="web-form">
                    <a
                        href={CONTACT_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        via web form (for non-GitHub users)
                    </a>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item>
                <a
                    href={CONTACT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Contact us
                </a>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <Button onClick={(e) => e.preventDefault()} type="ghost">
                Help {DownArrow}
            </Button>
        </Dropdown>
    );
};

export default HelpMenu;
