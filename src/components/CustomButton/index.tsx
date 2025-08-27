import React, { ReactNode, useState, forwardRef } from "react";
import { Button as AntButton, Tooltip } from "antd";
import styled, { css, RuleSet } from "styled-components";
import type { ButtonProps as AntButtonProps } from "antd";
import {
    NAV_BAR_TOOLTIP_OFFSET,
    TOOLTIP_COLOR,
    TOOLTIP_DELAY,
} from "../../constants";
import { ButtonClass, TooltipPlacement } from "../../constants/interfaces";
import { ThemedProps } from "../../styles/theme/theme";

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

interface TooltipButtonProps extends CustomButtonProps {
    tooltipText: TooltipText;
    tooltipPlacement?: TooltipPlacement;
}

const baseStyles = css<ThemedProps>`
    font-family: ${(props) => props.theme.typography};
    border-radius: 3px;
    height: 32px;
    padding: 6px 16px;
    font-size: 14px;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border: none;
    outline-offset: 1px;

    &:disabled {
        cursor: not-allowed;
    }
`;

const generateButtonStyles = (
    variant: "primary" | "secondary",
    theme: "light" | "dark"
) => css<ThemedProps>`
    ${({
        theme: {
            colors: { button },
        },
    }) => {
        const buttonTheme = button[variant][theme];
        const { background, text, border, hover, focus, active, disabled } =
            buttonTheme;

        return css`
            background-color: ${background};
            color: ${text};
            border: 1px solid ${border};

            &&&& {
                &:hover:not(:disabled) {
                    background-color: ${hover.background};
                    border-color: ${hover.background};
                    color: ${hover.text};
                }

                &:focus-visible:not(:disabled) {
                    background-color: ${focus.background};
                    outline: 1px solid ${focus.outline};
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

const actionStyles = css<ThemedProps>`
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

        &&&& {
            &:hover:not(:disabled) {
                color: ${action.hover.background};
            }

            &:focus-visible:not(:disabled) {
                outline: 1px solid ${action.focus.outline};
                color: ${action.focus.text};
            }

            &:disabled {
                color: ${action.disabled.text};
            }
        }
    `}
`;

const variantStyles: Record<ButtonClass, RuleSet<ThemedProps>> = {
    [ButtonClass.LightPrimary]: generateButtonStyles("primary", "light"),
    [ButtonClass.LightSecondary]: generateButtonStyles("secondary", "light"),
    [ButtonClass.DarkPrimary]: generateButtonStyles("primary", "dark"),
    [ButtonClass.DarkSecondary]: generateButtonStyles("secondary", "dark"),
    [ButtonClass.Action]: actionStyles,
};

const StyledButton = styled(AntButton)<CustomButtonProps & ThemedProps>`
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
        return (
            <StyledButton
                ref={ref}
                variant={variant}
                onClick={onClick}
                disabled={disabled}
                {...props}
            >
                {titleText || children} {icon}
            </StyledButton>
        );
    }
);

CustomButton.displayName = "CustomButton";

export const TooltipButton: React.FC<TooltipButtonProps> = ({
    tooltipText = { defaultText: "", disabledText: "" },
    tooltipPlacement,
    disabled = false,
    ...buttonProps
}) => {
    const tooltipRenderText = disabled
        ? tooltipText.disabledText
        : tooltipText.defaultText;
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        setTooltipVisible(true);
        buttonProps.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        setTooltipVisible(false);
        buttonProps.onMouseLeave?.(e);
    };

    return (
        <div
            className="inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Tooltip
                placement={tooltipPlacement}
                title={tooltipRenderText}
                color={TOOLTIP_COLOR}
                mouseEnterDelay={TOOLTIP_DELAY}
                align={{ targetOffset: NAV_BAR_TOOLTIP_OFFSET }}
                trigger={["hover", "focus"]}
                open={tooltipVisible}
            >
                <div>
                    <CustomButton {...buttonProps} disabled={disabled} />
                </div>
            </Tooltip>
        </div>
    );
};
