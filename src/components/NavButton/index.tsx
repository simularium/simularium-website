import React, { ReactNode } from "react";
import { Button, ButtonProps } from "antd";
import classNames from "classnames";

import styles from "./style.css";

export interface NavButtonProps extends ButtonProps {
    titleText?: string;
    buttonType?: string;
    icon?: ReactNode;
    clickHandler?: () => void;
    isDisabled?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
    className,
    titleText,
    buttonType,
    icon,
    clickHandler,
    isDisabled,
    ...props
}) => {
    const buttonClassNames = classNames(
        className,
        styles.navButton,
        buttonType && styles[buttonType],
        isDisabled && styles.disabled
    );

    return (
        <Button
            {...props}
            className={buttonClassNames}
            onClick={!isDisabled ? clickHandler : undefined}
        >
            {titleText} {icon}
        </Button>
    );
};

export default NavButton;
