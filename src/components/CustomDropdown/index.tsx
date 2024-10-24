import React, { ReactNode } from "react";
import classNames from "classnames";
import { Dropdown, DropDownProps, MenuProps } from "antd";
import { ButtonClass } from "../../constants/interfaces";
import NavButton from "../NavButton";

import styles from "./style.css";

interface CustomDropdownProps {
    items: MenuProps["items"];
    titleText: string;
    icon: ReactNode;
    buttonType: ButtonClass;
    placement?: DropDownProps["placement"];
    disabled?: boolean;
    narrow?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    items,
    titleText,
    icon,
    buttonType,
    placement,
    disabled,
    narrow,
}) => {
    const menuClassNames = narrow
        ? classNames(styles.menu, styles.narrow)
        : styles.menu;
    return (
        <Dropdown
            menu={{ items, theme: "dark", className: menuClassNames }}
            placement={placement}
            disabled={disabled}
        >
            <NavButton
                titleText={titleText}
                icon={icon}
                buttonType={buttonType}
            />
        </Dropdown>
    );
};

export default CustomDropdown;
