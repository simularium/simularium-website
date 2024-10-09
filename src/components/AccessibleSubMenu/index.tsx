import { MenuProps, Menu } from "antd";
import React from "react";
import { DropdownState } from "../../constants/interfaces";

interface AccessibleSubMenuProps {
    subMenuRef: React.RefObject<HTMLDivElement>;
    className: string;
    subMenuItems: MenuProps["items"];
    handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    subMenuOpenState: DropdownState;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const AccessibleSubmenu = ({
    subMenuRef,
    className,
    subMenuItems,
    handleKeyDown,
    subMenuOpenState,
    onMouseEnter,
    onMouseLeave,
}: AccessibleSubMenuProps): JSX.Element | null => {
    const menuVisible = subMenuOpenState !== DropdownState.CLOSED;
    return (
        <div
            ref={subMenuRef}
            className={className}
            aria-hidden={subMenuOpenState === DropdownState.CLOSED}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {menuVisible && (
                <Menu items={subMenuItems} onKeyDown={handleKeyDown} />
            )}
        </div>
    );
};

export default AccessibleSubmenu;
