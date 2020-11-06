import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";

import { TUTORIAL_PATHNAME } from "../../routes";
import { DownArrow } from "../Icons";

const styles = require("./style.css");

const SupportMenu: React.FunctionComponent<{}> = () => {
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
                <a
                    href="https://forum.allencell.org/c/software-code/simularium/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Forum
                </a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href="https://github.com/allen-cell-animated/simularium-website"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </Menu.Item>
            <Menu.Item>
                <a
                    href="https://forms.gle/mwoJjaj3PcbTVStU7"
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
            <Button
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                type="ghost"
            >
                Support {DownArrow}
            </Button>
        </Dropdown>
    );
};

export default SupportMenu;
