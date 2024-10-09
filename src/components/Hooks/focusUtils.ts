import { useCallback, useEffect, useRef } from "react";

import { DROPDOWN_HOVER_DELAY } from "../../constants";
import { DropdownState } from "../../constants/interfaces";

/**
 * Three utils to get the focusable elements within a container,
 * and either the previous or next focusable element in a container, relative
 * to an active element.
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
        'a[href]:not([tabindex="-1"])',
        'button:not([disabled]):not([tabindex="-1"])',
        'textarea:not([disabled]):not([tabindex="-1"])',
        'input:not([type="hidden"]):not([disabled]):not([tabindex="-1"])',
        'select:not([disabled]):not([tabindex="-1"])',
        '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors.join(","))
    ).filter(
        (el) =>
            !el.hasAttribute("disabled") &&
            !el.getAttribute("aria-hidden") &&
            el.offsetParent !== null // Exclude elements not visible
    );

    return focusableElements;
};

export const getPreviousFocusableElement = (
    container: HTMLElement,
    currentElement: HTMLElement
): HTMLElement | null => {
    const focusableElements = getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex > 0) {
        return focusableElements[currentIndex - 1];
    }

    return null;
};

export const getNextFocusableElement = (
    container: HTMLElement,
    currentElement: HTMLElement
): HTMLElement | null => {
    const focusableElements = getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
        return focusableElements[currentIndex + 1];
    }

    return null;
};

/**
 * This hook toggles a tabIndex attribute on the antd menu wrapper
 * appropriately based on whether keyboard or mouse navigation is used.
 */
export const useAntMenuWrapperFocus = (
    elementRef: React.RefObject<HTMLElement>,
    state: DropdownState
) => {
    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            const menuElement = element.querySelector(
                ".ant-dropdown-menu"
            ) as HTMLElement;
            if (menuElement) {
                if (state === DropdownState.FORCED_OPEN) {
                    menuElement.setAttribute("tabIndex", "-1");
                } else if (state === DropdownState.CLOSED) {
                    menuElement.setAttribute("tabIndex", "0");
                }
            }
        }
    }, [elementRef, state]);
};

/**
 * This hook manages click and hover interactions for menus
 * and submenus, opening with hover/click, but not overriding
 * an open state originating in keyboard navigation, and
 * closing with a delay when hover leaves.
 * Returns the handlers for the menu trigger element.
 */
export const useMenuInteraction = (
    currentState: DropdownState,
    setMenuState: (state: DropdownState) => void
) => {
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMenuMouseLeaveWithDelay = useCallback(() => {
        if (currentState !== DropdownState.FORCED_OPEN) {
            closeTimeoutRef.current = setTimeout(() => {
                setMenuState(DropdownState.CLOSED);
            }, DROPDOWN_HOVER_DELAY);
        }
    }, [currentState, setMenuState]);

    const handleMenuMouseEnter = useCallback(() => {
        if (currentState === DropdownState.CLOSED) {
            setMenuState(DropdownState.OPEN);
        }
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
    }, [currentState, setMenuState]);

    return {
        handleMenuMouseLeaveWithDelay,
        handleMenuMouseEnter,
    };
};
