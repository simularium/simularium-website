import React, { ReactNode, forwardRef } from "react";
import { Button, ButtonProps } from "antd";
import classNames from "classnames";
import styles from "./style.css";
import { ButtonClass } from "../../constants/interfaces";

export interface NavButtonProps extends ButtonProps {
    titleText?: string;
    buttonType?: string;
    icon?: ReactNode;
    clickHandler?: () => void;
    isDisabled?: boolean;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
    (
        {
            className,
            titleText,
            buttonType = ButtonClass.Action,
            icon,
            clickHandler,
            isDisabled,
            ...props
        },
        ref
    ) => {
        const buttonClassNames = classNames(
            className,
            styles.navButton,
            styles[buttonType],
            { [styles.disabled]: isDisabled }
        );

        return (
            <Button
                {...props}
                ref={ref}
                className={buttonClassNames}
                onClick={!isDisabled ? clickHandler : undefined}
            >
                {titleText} {icon}
            </Button>
        );
    }
);

NavButton.displayName = "NavButton";

export default NavButton;
