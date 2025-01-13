import React, { ReactNode, useState, useEffect, forwardRef } from "react";
import { Button as AntButton, Tooltip } from "antd";
import styled, { css, RuleSet } from "styled-components";
import type { ButtonProps as AntButtonProps } from "antd";
import {
    NAV_BAR_TOOLTIP_OFFSET,
    TOOLTIP_COLOR,
    TOOLTIP_DELAY,
} from "../../constants";
import { ButtonClass, TooltipPlacement } from "../../constants/interfaces";

interface CustomButtonProps extends Omit<AntButtonProps, "type" | "variant"> {
    variant?: ButtonClass;
    titleText?: string;
    icon?: ReactNode;
    onClick?: () => void;
}

interface TooltipText {
    defaultText: string;
    disabledText?: string;
}

interface WithTooltipProps extends CustomButtonProps {
    tooltipText: TooltipText;
    tooltipPlacement?: TooltipPlacement;
}

const baseStyles = css`
    font-family: ${(props) => props.theme.typography};
    border-radius: 3px;
    height: 32px;
    padding: 6px 16px;
    font-size: 14px;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: 1px solid ${({ theme }) => theme.colors.lightPurpleBg};
        outline-offset: 1px;
    }
`;

const generateButtonStyles = (
    variant: "primary" | "secondary",
    theme: "light" | "dark"
) => css`
    ${({
        theme: {
            colors: { button },
        },
    }) => {
        const buttonTheme = button[variant][theme];
        const { background, text, border, hover, active, disabled } =
            buttonTheme;

        return css`
            background-color: ${background};
            border: 1px solid ${variant === "primary" ? background : border};
            color: ${text};

            &&& {
                &:hover:not(:disabled) {
                    background-color: ${hover.background};
                    border-color: ${hover.background};
                    color: ${hover.text};
                }

                &:active:not(:disabled) {
                    background-color: ${hover.background};
                    border-color: ${active.background};
                    color: ${active.text};
                }

                &:disabled {
                    background-color: ${disabled.background};
                    border-color: ${disabled.background};
                    color: ${disabled.text};
                }
            }
        `;
    }}
`;

const actionStyles = css`
    ${({
        theme: {
            colors: {
                button: { action },
            },
        },
    }) => css`
        background: ${action.background};
        border: none;
        color: ${action.text};
        padding: 6px 8px;
        min-width: auto;

        &&& {
            &:hover:not(:disabled) {
                color: ${action.hover.background};
            }

            &:active:not(:disabled) {
                border: ${action.active.text};
                color: ${action.active.text};
            }

            &:disabled {
                color: ${action.disabled.text};
            }
        }
    `}
`;

const variantStyles: Record<ButtonClass, RuleSet<object>> = {
    [ButtonClass.LightPrimary]: generateButtonStyles("primary", "light"),
    [ButtonClass.LightSecondary]: generateButtonStyles("secondary", "light"),
    [ButtonClass.DarkPrimary]: generateButtonStyles("primary", "dark"),
    [ButtonClass.DarkSecondary]: generateButtonStyles("secondary", "dark"),
    [ButtonClass.Action]: actionStyles,
};

const StyledButton = styled(AntButton)<CustomButtonProps>`
    ${baseStyles}
    ${({ variant = ButtonClass.LightPrimary }) => variantStyles[variant]}
`;

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    (
        {
            children,
            variant = ButtonClass.LightPrimary,
            titleText,
            icon,
            onClick,
            disabled,
            ...props
        },
        ref
    ) => {
        const handleClick = () => {
            if (!disabled) {
                onClick?.();
            }
        };

        return (
            <StyledButton
                ref={ref}
                variant={variant}
                onClick={() => handleClick}
                disabled={disabled}
                {...props}
            >
                {titleText || children} {icon}
            </StyledButton>
        );
    }
);

CustomButton.displayName = "CustomButton";

export const TooltipButton: React.FC<WithTooltipProps> = ({
    tooltipText = { defaultText: "", disabledText: "" },
    tooltipPlacement,
    disabled = false,
    ...buttonProps
}) => {
    const [tooltipRenderText, setTooltipRenderText] = useState(
        disabled ? tooltipText.disabledText : tooltipText.defaultText
    );
    const [tooltipVisible, setTooltipVisible] = useState(false);

    useEffect(() => {
        if (!tooltipVisible) {
            setTooltipRenderText(
                disabled ? tooltipText.disabledText : tooltipText.defaultText
            );
        }
    }, [disabled, tooltipText, tooltipVisible]);

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        setTooltipVisible(true);
        buttonProps.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        setTooltipVisible(false);
        buttonProps.onMouseLeave?.(e);
    };

    return (
        <Tooltip
            placement={tooltipPlacement}
            title={tooltipRenderText}
            color={TOOLTIP_COLOR}
            mouseEnterDelay={TOOLTIP_DELAY}
            align={{ targetOffset: NAV_BAR_TOOLTIP_OFFSET }}
            trigger={["hover", "focus"]}
            open={tooltipVisible}
        >
            <CustomButton
                {...buttonProps}
                disabled={disabled}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        </Tooltip>
    );
};
