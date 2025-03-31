import React from "react";
import { Link, LinkProps } from "react-router-dom";
import styled, { css } from "styled-components";
import { ArrowRight } from "../Icons";

// Dropdown items can be of a few component
// varieties, including buttons, router links, and
// anchor tags. This file unifies their styling,
// and then divides them into three component exports
// for semantically explicit usage in dropdowns.

// Common styles
const baseStyles = css`
    font-family: ${(props) => props.theme.typography};
    background: none;
    border: 2px solid ${({ theme }) => theme.colors.dropdown.background};
    border-radius: 3px;
    color: ${({ theme }) => theme.colors.dropdown.text};
    cursor: pointer;
    height: 28px;
    padding: 6px;
    width: 100%;
    min-width: 177px;
    font-size: 14px;

    &&& {
        align-items: center;
        &:focus-visible,
        &:focus-visible:hover {
            outline: 1.5px solid ${({ theme }) => theme.colors.dropdown.active};
            border: 2px solid ${({ theme }) => theme.colors.dropdown.background};
            color: ${({ theme }) => theme.colors.dropdown.activeTextColor};
            background-color: ${({ theme }) => theme.colors.dropdown.active};

            svg {
                fill: ${({ theme }) => theme.colors.dropdown.background};
            }
        }

        &:hover:not(:focus-visible) {
            background-color: ${({ theme }) => theme.colors.dropdown.active};
            color: ${({ theme }) => theme.colors.dropdown.activeTextColor};
            border-color: ${({ theme }) => theme.colors.dropdown.active};

            svg {
                fill: ${({ theme }) => theme.colors.dropdown.background};
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

    svg {
        font-size: 10px;
    }
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
export const DropdownButton: React.FC<ButtonProps> = ({
    children,
    className,
    onClick,
    isSubmenuTrigger,
}) => (
    <StyledDropdownButton type="button" onClick={onClick} className={className}>
        {children}
        {isSubmenuTrigger && ArrowRight}
    </StyledDropdownButton>
);

export const DropdownRouterLink: React.FC<RouterProps> = ({
    children,
    className,
    to,
    newTab,
    onClick,
}) => (
    <StyledRouterLink
        to={to}
        className={className}
        onClick={onClick}
        {...getNewTabAttributes(newTab)}
    >
        {children}
    </StyledRouterLink>
);

export const DropdownAnchor: React.FC<AnchorProps> = ({
    children,
    className,
    href,
    newTab,
}) => (
    <StyledExternalLink
        href={href}
        className={className}
        {...getNewTabAttributes(newTab)}
    >
        {children}
    </StyledExternalLink>
);
