import React, { ReactNode } from "react";
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
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    items,
    titleText,
    icon,
    buttonType,
    placement,
    disabled,
}) => {
    return (
        <Dropdown
            menu={{ items, theme: "dark", className: styles.menu }}
            placement={placement}
            disabled={disabled}
            open={true}
            dropdownRender={(menu) => (
                <div className={styles.menuWrapper}>{menu}</div>
            )}
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
