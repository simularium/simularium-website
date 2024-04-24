import React, { ReactNode } from "react";
import { Button, ButtonProps, Tooltip, TooltipProps } from "antd";
import classNames from "classnames";

import { TOOLTIP_COLOR } from "../../constants";
import styles from "./style.css";

interface ViewportButtonProps extends ButtonProps {
    tooltipText?: string;
    tooltipPlacement?: TooltipProps["placement"];
    tooltipWhenDisabled?: boolean;
    icon?: ReactNode | string; // When using an icomoon icon, pass the right IconGlyphs member as defined in src/constants/interfaces
    radioGroupPosition?: "top" | "bottom";
    clickHandler?: () => void;
    disabled?: boolean;
    active?: boolean;
    loading?: boolean;
}

const ViewportButton: React.FC<ViewportButtonProps> = ({
    className,
    tooltipText,
    tooltipPlacement,
    tooltipWhenDisabled,
    icon,
    clickHandler,
    disabled,
    loading,
    active,
    radioGroupPosition,
    ...props
}) => {
    const getIcon = () => {
        // if icon is a react element, return it as is
        // if its a string provide it as a class name to render the appropriate icon
        // from global style selectors
        if (React.isValidElement(icon)) {
            return icon;
        }
        if (typeof icon === "string") {
            return <span className={icon} />;
        }
    };

    const radioGroupStyle = (): string => {
        switch (radioGroupPosition) {
            case "top":
                return styles.radioGroupTop;
            case "bottom":
                return styles.radioGroupBottom;
            default:
                return "";
        }
    };

    const getTooltip = () =>
        !disabled || tooltipWhenDisabled ? tooltipText : "";

    const getClickHandler = () => (!disabled ? clickHandler : undefined);

    const buttonClassNames = classNames([
        className,
        styles.viewportButton,
        disabled && styles.disabled,
        active && styles.active,
        radioGroupPosition && radioGroupStyle(),
    ]);
    return (
        <Tooltip
            placement={tooltipPlacement}
            title={getTooltip()}
            color={TOOLTIP_COLOR}
        >
            <Button
                {...props}
                className={buttonClassNames}
                onClick={getClickHandler()}
                loading={loading}
                icon={getIcon()}
            />
        </Tooltip>
    );
};

export default ViewportButton;
