import { useState, useRef, KeyboardEventHandler, useEffect } from "react";
import { DropdownState } from "../../constants/interfaces";
import { DROPDOWN_HOVER_DELAY } from "../../constants";

export const useDropdownFocus = () => {
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
    const handleKeyDown: KeyboardEventHandler<any> = (event) => {
        if (dropdownState === DropdownState.CLOSED) {
            if (
                (event.key === "Enter" ||
                    event.key === " " ||
                    event.key === "ArrowDown") &&
                !event.defaultPrevented
            ) {
                event.preventDefault();
                setDropdownState(DropdownState.FORCED_OPEN); // Opened by keyboard
            }
        } else if (event.key === "Escape") {
            event.preventDefault();
            setDropdownState(DropdownState.CLOSED);
            triggerRef.current?.focus();
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

    return {
        dropdownState,
        setDropdownState,
        triggerRef,
        dropdownRef,
        handleKeyDown,
        handleMouseLeaveWithDelay,
        handleMouseEnter,
    };
};
