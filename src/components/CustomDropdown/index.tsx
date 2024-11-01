import React, {
    KeyboardEventHandler,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { Dropdown, DropDownProps, MenuProps } from "antd";
import { ButtonClass, DropdownState } from "../../constants/interfaces";
import { DROPDOWN_HOVER_DELAY } from "../../constants";
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
    const [dropdownState, setDropdownState] = useState<DropdownState>(
        DropdownState.CLOSED
    );

    const triggerRef = useRef<HTMLElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Prevents the menu wrapper from capturing focus,
     * this prevents losing focus to the body
     * when "Escape" is pressed.
     */
    useEffect(() => {
        const element = dropdownRef.current;
        if (element) {
            const menuElement = element.querySelector(
                ".ant-dropdown-menu"
            ) as HTMLElement;
            if (menuElement) {
                if (dropdownState === DropdownState.FORCED_OPEN) {
                    menuElement.setAttribute("tabIndex", "-1");
                } else if (dropdownState === DropdownState.CLOSED) {
                    menuElement.setAttribute("tabIndex", "0");
                }
            }
        }
    }, [dropdownRef, dropdownState]);

    /**
     * Manually handling keydown and hover behavior because
     * our focus management overrides the defaults of the antd components.
     */
    const openTriggers = new Set(["Enter", " ", "ArrowDown"]);

    const handleKeyDown: KeyboardEventHandler<any> = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            setDropdownState(DropdownState.CLOSED);
            triggerRef.current?.focus();
        }
        if (
            openTriggers.has(event.key) &&
            dropdownState === DropdownState.CLOSED
        ) {
            event.preventDefault();
            setDropdownState(DropdownState.FORCED_OPEN); // Opened by keyboard
        }
    };

    const handleMouseEnter = () => {
        if (dropdownState === DropdownState.CLOSED) {
            setDropdownState(DropdownState.OPEN);
        }
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
    };

    const handleMouseLeaveWithDelay = () => {
        if (dropdownState !== DropdownState.FORCED_OPEN) {
            closeTimeoutRef.current = setTimeout(() => {
                setDropdownState(DropdownState.CLOSED);
            }, DROPDOWN_HOVER_DELAY);
        }
    };

    const buttonClickHandler = () => {
        setDropdownState(
            dropdownState === DropdownState.CLOSED
                ? DropdownState.OPEN
                : DropdownState.CLOSED
        );
    };

    return (
        <Dropdown
            menu={{ items, theme: "dark", className: styles.menu }}
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
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
                titleText={titleText}
                icon={icon}
                buttonType={buttonType}
                clickHandler={buttonClickHandler}
                onKeyDown={handleKeyDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeaveWithDelay}
            />
        </Dropdown>
    );
};

export default CustomDropdown;
