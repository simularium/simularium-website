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
import { ButtonClass } from "../../constants/interfaces";
import { DownArrow } from "../Icons";
import VersionModal from "../VersionModal";
import NavButton from "../NavButton";
import CustomDropdown from "../CustomDropdown";

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
                <NavButton
                    titleText={"Version info"}
                    clickHandler={() => {
                        setModalVisible(!modalVisible);
                    }}
                    buttonType={ButtonClass.DropdownItem}
                />
            ),
        },
    ];

    return (
        <>
            <CustomDropdown
                items={items}
                titleText={"Help "}
                icon={DownArrow}
                buttonType={ButtonClass.Secondary}
                narrow={true}
            />
            {modalVisible && <VersionModal setModalVisible={setModalVisible} />}
        </>
    );
};

export default HelpMenu;
