import React, { ReactNode } from "react";
import { Button, ButtonProps } from "antd";
import classNames from "classnames";

import styles from "./style.css";
import { ButtonClass } from "../../constants/interfaces";

export interface NavButtonProps extends ButtonProps {
    titleText?: string;
    buttonType?: string;
    icon?: ReactNode;
    onClick?: () => void;
    isDisabled?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
    className,
    titleText,
    buttonType = ButtonClass.Action,
    icon,
    onClick,
    isDisabled,
    ...props
}) => {
    // NavButtons default to action button styling, provide secondary or primary to override
    const buttonClassNames = classNames(
        className,
        styles.navButton,
        styles[buttonType],
        { [styles.disabled]: isDisabled }
    );

    return (
        <Button
            {...props}
            className={buttonClassNames}
            onClick={!isDisabled ? onClick : undefined}
        >
            {titleText} {icon}
        </Button>
    );
};

export default NavButton;
