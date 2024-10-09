import {
    useState,
    useRef,
    useCallback,
    KeyboardEventHandler,
    useEffect,
} from "react";
import { DropdownState } from "../../constants/interfaces";
import {
    getFocusableElements,
    getNextFocusableElement,
    useAntMenuWrapperFocus,
    useMenuInteraction,
} from "./focusUtils";

interface UseSubmenuFocusProps {
    parentMenuRef: React.RefObject<HTMLElement>;
    triggerRef: React.RefObject<HTMLElement>;
}

export const useSubMenuFocus = ({
    parentMenuRef,
    triggerRef,
}: UseSubmenuFocusProps) => {
    const [subMenuOpenState, setSubMenuOpenState] = useState(
        DropdownState.CLOSED
    );
    const firstSubmenuElementRef = useRef<HTMLElement | null>(null);
    const lastSubmenuElementRef = useRef<HTMLElement | null>(null);
    const nextFocusTargetRef = useRef<HTMLElement | null>(null);
    const subMenuRef = useRef<HTMLDivElement | null>(null);

    /**
     * This hook manages the focus state of antd menu wrappers based on
     * whether it is opened by mouse or keyboard, moving
     * focus to first element when keyboard navigation is used.
     */
    useAntMenuWrapperFocus(subMenuRef, subMenuOpenState);

    /**
     * Get the beginning and end of the submenu items, as well as the
     * next tabbable element in the parent to correctly manage "flyout"
     * menu behavior.
     * https://www.w3.org/WAI/tutorials/menus/flyout/
     */
    useEffect(() => {
        if (subMenuOpenState && subMenuRef.current) {
            const focusableElements = getFocusableElements(subMenuRef.current);
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
            firstSubmenuElementRef.current = focusableElements[0];
            lastSubmenuElementRef.current =
                focusableElements[focusableElements.length - 1];
            nextFocusTargetRef.current = getNextFocusableElement(
                parentMenuRef.current as HTMLElement,
                triggerRef.current as HTMLElement
            );
        }
    }, [subMenuOpenState, parentMenuRef, triggerRef]);

    /**
     * Position the submenu relative to the parent menu
     */
    const handleSubMenuPositioning = () => {
        if (subMenuRef.current && parentMenuRef.current) {
            subMenuRef.current.style.right = `${subMenuRef.current.offsetWidth}px`;

            subMenuRef.current.style.top = `${-subMenuRef.current
                .offsetHeight}px`;
        }
    };
    window.addEventListener("resize", handleSubMenuPositioning);
    useEffect(() => {
        const menuElement = subMenuRef.current?.querySelector(
            ".ant-dropdown-menu"
        ) as HTMLElement;
        if (document.activeElement === menuElement) {
            firstSubmenuElementRef.current?.focus();
        }
        if (subMenuOpenState) {
            handleSubMenuPositioning();
        }
    }, [subMenuOpenState]);

    const handleKeyDown: KeyboardEventHandler<any> = useCallback(
        (event) => {
            if (subMenuOpenState === DropdownState.CLOSED) {
                if (
                    (event.key === "Enter" || event.key === " ") &&
                    !event.defaultPrevented
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                    setSubMenuOpenState(DropdownState.FORCED_OPEN);
                }
            } else {
                switch (event.key) {
                    case "Escape":
                        event.preventDefault();
                        event.stopPropagation();
                        setSubMenuOpenState(DropdownState.CLOSED);
                        triggerRef.current?.focus();
                        break;
                    case "ArrowUp":
                        if (
                            document.activeElement ===
                                firstSubmenuElementRef.current &&
                            parentMenuRef.current
                        ) {
                            event.preventDefault();
                            event.stopPropagation();
                            triggerRef.current?.focus();
                            setSubMenuOpenState(DropdownState.CLOSED);
                        }
                        break;
                    case "ArrowDown":
                        if (
                            document.activeElement ===
                                lastSubmenuElementRef.current &&
                            parentMenuRef.current
                        ) {
                            event.preventDefault();
                            event.stopPropagation();
                            setSubMenuOpenState(DropdownState.CLOSED);
                            nextFocusTargetRef.current?.focus();
                        }
                        break;
                    case "Tab":
                        if (
                            !event.shiftKey &&
                            document.activeElement ===
                                lastSubmenuElementRef.current
                        ) {
                            event.preventDefault();
                            setSubMenuOpenState(DropdownState.CLOSED);
                            if (parentMenuRef.current && triggerRef.current) {
                                const nextElement = getNextFocusableElement(
                                    parentMenuRef.current,
                                    triggerRef.current
                                );
                                nextElement?.focus();
                            }
                        } else if (
                            event.shiftKey &&
                            document.activeElement ===
                                firstSubmenuElementRef.current
                        ) {
                            event.preventDefault();
                            setSubMenuOpenState(DropdownState.CLOSED);
                            triggerRef.current?.focus();
                        }
                        break;
                }
            }
        },
        [subMenuOpenState, parentMenuRef, triggerRef]
    );

    const {
        handleMenuMouseLeaveWithDelay: handleSubMenuMouseLeaveWithDelay,
        handleMenuMouseEnter: handleSubMenuMouseEnter,
    } = useMenuInteraction(subMenuOpenState, setSubMenuOpenState);

    return {
        subMenuOpenState,
        subMenuRef,
        handleKeyDown,
        setSubMenuOpenState,
        handleSubMenuMouseEnter,
        handleSubMenuMouseLeaveWithDelay,
    };
};
