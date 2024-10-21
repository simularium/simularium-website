import React, { ReactNode } from "react";
import classNames from "classnames";
import { Dropdown, DropDownProps, MenuProps } from "antd";
import { ButtonClass, DropdownState } from "../../constants/interfaces";
import NavButton from "../NavButton";
import { useDropdownFocus } from "./useDropdownFocus";

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
    /**
     * Calling this hook and exposing the necssary props
     * to manage focus in the dropdown
     */
    const {
        dropdownState,
        setDropdownState,
        triggerRef,
        dropdownRef,
        handleKeyDown,
        handleMouseLeaveWithDelay,
        handleMouseEnter,
    } = useDropdownFocus();

    const menuClassNames = narrow
        ? classNames(styles.menu, styles.narrow)
        : styles.menu;
    return (
        <Dropdown
            menu={{ items, theme: "dark", className: menuClassNames }}
            placement={placement}
            disabled={disabled}
            trigger={["click"]}
            open={dropdownState !== DropdownState.CLOSED}
            autoFocus={true}
            dropdownRender={(menu) => (
                <div
                    ref={dropdownRef}
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeaveWithDelay}
                >
                    {menu}
                </div>
            )}
        >
            <NavButton
                titleText={titleText}
                icon={icon}
                buttonType={buttonType}
                clickHandler={() => {
                    setDropdownState(
                        dropdownState === DropdownState.CLOSED
                            ? DropdownState.OPEN
                            : DropdownState.CLOSED
                    );
                }}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => {
                    if (dropdownState === DropdownState.FORCED_OPEN) {
                        return;
                    }
                    setDropdownState(DropdownState.OPEN);
                }}
                onMouseLeave={handleMouseLeaveWithDelay}
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
            />
        </Dropdown>
    );
};

export default CustomDropdown;
