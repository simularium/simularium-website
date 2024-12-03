import React from "react";
import { Link, LinkProps } from "react-router-dom";
import styled, { css } from "styled-components";
import { ArrowRight } from "../Icons";

// Dropdown items can have a variety of base html
// elements, including buttons, router links, and
// anchor tags. This file unifies their styling,
// and then divides them into three component exports
// for semantically explicit usage in menus.

// Common styles
const baseStyles = css`
    background: none;
    border: 2px solid var(--dark-theme-dropdown-menu-bg);
    border-radius: 3px;
    color: var(--dark-theme-dropdown-menu-item-color);
    cursor: pointer;
    display: flex;
    height: 28px;
    min-width: 0px;
    padding: 4px;
    transition: none !important;
    width: 100%;
    text-decoration: none;

    svg {
        fill: var(--dark-theme-dropdown-menu-item-color);
        font-size: 10px;
        transition: fill 0.2s ease;
    }

    &&& {
        &:focus {
            outline: 1.5px solid
                var(--dark-theme-dropdown-menu-item-focus-outline);
            border: 2px solid var(--dark-theme-dropdown-menu-bg);
            color: var(--dark-theme-dropdown-menu-item-hover-color);
            background-color: var(--dark-theme-dropdown-menu-item-hover-bg);

            svg {
                fill: var(--dark-theme-dropdown-menu-item-hover-color);
            }
        }

        &:hover:not(:focus) {
            background-color: var(--dark-theme-dropdown-menu-item-hover-bg);
            color: var(--dark-theme-dropdown-menu-item-hover-color);
            border-color: var(--dark-theme-dropdown-menu-item-hover-bg);

            svg {
                fill: var(--dark-theme-dropdown-menu-item-hover-color);
            }
        }
    }
`;

const contentStyles = css`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    color: inherit;
`;

// Styled components
const StyledDropdownButton = styled.button`
    ${baseStyles}
    ${contentStyles}
`;

const StyledRouterLink = styled(Link)`
    ${baseStyles}
    ${contentStyles}
`;

const StyledExternalLink = styled.a`
    ${baseStyles}
    ${contentStyles}
`;

// Typing for the props of each variant
interface BaseDropdownItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

interface ButtonProps extends BaseDropdownItemProps {
    onClick?: () => void;
    isSubmenuTrigger?: boolean;
}

interface RouterProps extends BaseDropdownItemProps {
    to: LinkProps["to"];
    newTab?: boolean;
}

interface AnchorProps extends Omit<BaseDropdownItemProps, "onClick"> {
    href: string;
    newTab?: boolean;
}

const getNewTabAttributes = (newTab?: boolean) =>
    newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

// Components for use in dropdown menus:
export const DropdownButton = ({
    children,
    className,
    onClick,
    isSubmenuTrigger,
}: ButtonProps) => (
    <StyledDropdownButton type="button" onClick={onClick} className={className}>
        {children}
        {isSubmenuTrigger && ArrowRight}
    </StyledDropdownButton>
);

export const DropdownRouterLink = ({
    children,
    className,
    to,
    newTab,
}: RouterProps) => (
    <StyledRouterLink
        to={to}
        className={className}
        {...getNewTabAttributes(newTab)}
    >
        {children}
    </StyledRouterLink>
);

export const DropdownAnchor = ({
    children,
    className,
    href,
    newTab,
}: AnchorProps) => (
    <StyledExternalLink
        href={href}
        className={className}
        {...getNewTabAttributes(newTab)}
    >
        {children}
    </StyledExternalLink>
);
