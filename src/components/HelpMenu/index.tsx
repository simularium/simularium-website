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

import VersionModal from "../VersionModal";

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

    const [modalVisible, setModalVisible] = React.useState(false);

    const menu = (
        <Menu theme="dark" className={styles.menu}>
            {modalVisible ? (
                <VersionModal setModalVisible={setModalVisible} />
            ) : null}
            <Menu.Item key="tutorial">{tutorialLink}</Menu.Item>
            <Menu.Item key="forum">
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
            </Menu.Item>
            <Menu.SubMenu
                title="Submit issue"
                popupClassName={styles.submenu}
                popupOffset={[-0.45, -4]}
                key="submit-issue"
            >
                <Menu.Item key="submit-issue-github">
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
                        href={FORUM_BUG_REPORT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        via Forum (for non-GitHub users)
                    </a>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
                key="version"
                onClick={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <>Version Info</>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown menu={{ items, theme: "dark", className: styles.menu }}>
                <Button onClick={(e) => e.preventDefault()} type="ghost">
                    Help {DownArrow}
                </Button>
            </Dropdown>
            {modalVisible && <VersionModal setModalVisible={setModalVisible} />}
        </>
    );
};

export default HelpMenu;
