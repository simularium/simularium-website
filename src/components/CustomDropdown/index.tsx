import React, { ReactNode } from "react";
import { Dropdown, DropDownProps, MenuProps } from "antd";
import { ButtonClass } from "../../constants/interfaces";
import { CustomButton } from "../CustomButton";

import styles from "./style.css";

interface CustomDropdownProps {
    items: MenuProps["items"];
    titleText: string;
    icon: ReactNode;
    variant: ButtonClass;
    placement?: DropDownProps["placement"];
    disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    items,
    titleText,
    icon,
    variant,
    placement,
    disabled,
}) => {
    return (
        <Dropdown
            menu={{ items, theme: "dark", className: styles.menu }}
            placement={placement}
            disabled={disabled}
            dropdownRender={(menu) => (
                <div className={styles.menuWrapper}>{menu}</div>
            )}
        >
            <CustomButton titleText={titleText} icon={icon} variant={variant} />
        </Dropdown>
    );
};

export default CustomDropdown;
