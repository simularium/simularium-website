import * as React from "react";
import { useLocation } from "react-router-dom";
import { MenuProps } from "antd";

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
import CustomDropdown from "../CustomDropdown";
import {
    DropdownAnchor,
    DropdownButton,
    DropdownRouterLink,
} from "../CustomDropdown/DropdownMenuItems";

const HelpMenu = (): JSX.Element => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const location = useLocation();
    const tutorialLink =
        location.pathname === "/viewer" ? (
            <DropdownRouterLink to={TUTORIAL_PATHNAME} newTab={true}>
                Getting started
            </DropdownRouterLink>
        ) : (
            <DropdownRouterLink to={TUTORIAL_PATHNAME}>
                Quick start
            </DropdownRouterLink>
        );

    const items: MenuProps["items"] = [
        {
            key: "tutorial",
            label: tutorialLink,
        },
        {
            key: "forum",
            label: (
                <DropdownAnchor href={FORUM_URL} newTab={true}>
                    Forum
                </DropdownAnchor>
            ),
        },
        {
            key: "github",
            label: (
                <DropdownAnchor href={GITHUB_URL} newTab={true}>
                    GitHub
                </DropdownAnchor>
            ),
        },
        {
            key: "submit-issue",
            label: (
                <DropdownButton isSubmenuTrigger={true}>
                    Submit issue
                </DropdownButton>
            ),
            expandIcon: false,
            popupOffset: [-0.45, -4],
            children: [
                {
                    key: "via-github",
                    label: (
                        <DropdownAnchor href={ISSUE_URL}>
                            via GitHub (preferred)
                        </DropdownAnchor>
                    ),
                },
                {
                    key: "via-forum",
                    label: (
                        <DropdownAnchor href={FORUM_BUG_REPORT_URL}>
                            via Forum (for non-GitHub users)
                        </DropdownAnchor>
                    ),
                },
            ],
        },
        {
            key: "version",
            label: (
                <DropdownButton onClick={() => setModalVisible(!modalVisible)}>
                    Version info
                </DropdownButton>
            ),
        },
    ];

    return (
        <>
            <CustomDropdown
                items={items}
                titleText={"Resources"}
                icon={DownArrow}
                variant={ButtonClass.DarkSecondary}
            />
            {modalVisible && <VersionModal setModalVisible={setModalVisible} />}
        </>
    );
};

export default HelpMenu;
