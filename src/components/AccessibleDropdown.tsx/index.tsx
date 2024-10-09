import React from "react";
import { Dropdown, MenuProps, MenuTheme } from "antd";
import { ButtonClass, DropdownState } from "../../constants/interfaces";
import NavButton from "../NavButton";
import { useSubMenuFocus } from "../Hooks/useSubMenuFocus";
import { useDropdownFocus } from "../Hooks/useDropDownFocus";
import AccessibleSubmenu from "../AccessibleSubMenu";

interface AccessibleDropdownProps {
    containerRef: React.RefObject<HTMLElement>;
    preventGlobalHotkeys: any;
    items: MenuProps["items"];
    theme?: MenuTheme;
    className: string;
    buttonText: string;
    buttonIcon: any;
    buttonType: ButtonClass;
    subMenuOpenState?: boolean;
    submenuTriggerKey: string;
    subMenuItems?: MenuProps["items"];
    subMenuClassName: any;
    subMenuTriggerRef:
        | React.RefObject<HTMLAnchorElement>
        | React.RefObject<HTMLButtonElement>;
}

const AccessibleDropdown = ({
    containerRef,
    preventGlobalHotkeys,
    items,
    theme = "dark",
    className,
    buttonText,
    buttonIcon,
    buttonType,
    submenuTriggerKey,
    subMenuItems,
    subMenuClassName,
    subMenuTriggerRef,
}: AccessibleDropdownProps): JSX.Element => {
    /**
     * Calling this hook and exposing the necssary props
     * to manage focus in the dropdown
     */
    const {
        dropdownState,
        handleDropdownVisibility,
        triggerRef,
        dropdownRef,
        handleKeyDown,
        handleMouseLeaveWithDelay,
        handleMouseEnter,
    } = useDropdownFocus({
        preventGlobalHotkeys,
        containerRefProp: containerRef,
    });

    /**
     * Current implementations of dropdowns all have exactly one
     * submenu with one trigger.
     * Logic for multiple submenus can be added when needed.
     */
    const {
        subMenuRef,
        subMenuOpenState,
        handleKeyDown: handleSubMenuKeyDown,
        handleSubMenuMouseEnter,
        handleSubMenuMouseLeaveWithDelay,
    } = useSubMenuFocus({
        parentMenuRef: dropdownRef,
        triggerRef: subMenuTriggerRef,
    });

    const updatedMenuItems = items?.map((item) => {
        if (item?.key === submenuTriggerKey) {
            return {
                ...item,
                onMouseEnter: handleSubMenuMouseEnter,
                onMouseLeave: handleSubMenuMouseLeaveWithDelay,
                onKeyDown: handleSubMenuKeyDown,
            };
        }
        return item;
    });

    const subMenu = (
        <AccessibleSubmenu
            subMenuRef={subMenuRef}
            className={subMenuClassName}
            subMenuItems={subMenuItems}
            handleKeyDown={handleSubMenuKeyDown}
            subMenuOpenState={subMenuOpenState}
            onMouseEnter={handleSubMenuMouseEnter}
            onMouseLeave={handleSubMenuMouseLeaveWithDelay}
        />
    );

    return (
        <Dropdown
            menu={{
                items: updatedMenuItems,
                theme: theme,
                className: className,
            }}
            trigger={["click"]}
            open={dropdownState !== DropdownState.CLOSED}
            getPopupContainer={() => containerRef.current || document.body}
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
                    {subMenu}
                </div>
            )}
        >
            <NavButton
                className="prevent-global-hotkeys"
                titleText={buttonText}
                icon={buttonIcon}
                buttonType={buttonType}
                clickHandler={() => {
                    handleDropdownVisibility(
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
                    handleDropdownVisibility(DropdownState.OPEN);
                }}
                onMouseLeave={handleMouseLeaveWithDelay}
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
            />
        </Dropdown>
    );
};

export default AccessibleDropdown;
