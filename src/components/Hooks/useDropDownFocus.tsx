import React, {
    useState,
    useRef,
    useCallback,
    KeyboardEventHandler,
} from "react";
import { ActionCreator } from "redux";
import { SetPreventGlobalHotkeysAction } from "../../state/selection/types";
import { DropdownState } from "../../constants/interfaces";
import {
    getNextFocusableElement,
    getPreviousFocusableElement,
    useAntMenuWrapperFocus,
    useMenuInteraction,
} from "./focusUtils";

interface UseDropdownWithFocusProps {
    preventGlobalHotkeys: ActionCreator<SetPreventGlobalHotkeysAction>;
    containerRefProp?: React.RefObject<HTMLElement>;
}

export const useDropdownFocus = ({
    preventGlobalHotkeys,
    containerRefProp,
}: UseDropdownWithFocusProps) => {
    const [dropdownState, setDropdownState] = useState<DropdownState>(
        DropdownState.CLOSED
    );

    const triggerRef = useRef<HTMLElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const containerRef = containerRefProp || useRef<HTMLElement | null>(null);

    const handleDropdownVisibility = useCallback(
        (state: DropdownState) => {
            setDropdownState(state);
            if (
                state === DropdownState.OPEN ||
                state === DropdownState.FORCED_OPEN
            ) {
                preventGlobalHotkeys(true);
            } else {
                preventGlobalHotkeys(false);
            }
        },
        [preventGlobalHotkeys]
    );

    const handleKeyDown: KeyboardEventHandler<any> = useCallback(
        (event) => {
            if (dropdownState === DropdownState.CLOSED) {
                if (
                    (event.key === "Enter" ||
                        event.key === " " ||
                        event.key === "ArrowDown") &&
                    !event.defaultPrevented
                ) {
                    event.preventDefault();
                    handleDropdownVisibility(DropdownState.FORCED_OPEN); // Opened by keyboard
                }
            } else {
                switch (event.key) {
                    case "Escape":
                        event.preventDefault();
                        handleDropdownVisibility(DropdownState.CLOSED);
                        triggerRef.current?.focus();
                        break;
                    case "Tab":
                        if (event.shiftKey) {
                            event.preventDefault();
                            handleDropdownVisibility(DropdownState.CLOSED);
                            if (containerRef.current && triggerRef.current) {
                                const previousElement =
                                    getPreviousFocusableElement(
                                        containerRef.current,
                                        triggerRef.current
                                    );
                                previousElement?.focus();
                            }
                        } else {
                            event.preventDefault();
                            handleDropdownVisibility(DropdownState.CLOSED);
                            if (containerRef.current && triggerRef.current) {
                                const nextElement = getNextFocusableElement(
                                    containerRef.current,
                                    triggerRef.current
                                );
                                nextElement?.focus();
                            }
                        }
                        break;
                }
            }
        },
        [dropdownState, handleDropdownVisibility]
    );

    /**
     * Manually handling hover behavior because our focus management
     * overrides the defaults of the antd components.
     */
    const {
        // handleMenuTriggerClick: handleDropdownMenuTriggerClick,
        handleMenuMouseLeaveWithDelay: handleMouseLeaveWithDelay,
        handleMenuMouseEnter: handleMouseEnter,
    } = useMenuInteraction(dropdownState, handleDropdownVisibility);

    /**
     * This hook manages the focus state based on
     * whether it is opened by mouse or keyboard, moving
     * focus to first element when keyboard navigation is used.
     */
    useAntMenuWrapperFocus(dropdownRef, dropdownState);

    return {
        dropdownState,
        handleDropdownVisibility,
        triggerRef,
        dropdownRef,
        handleKeyDown,
        handleMouseLeaveWithDelay,
        handleMouseEnter,
    };
};
