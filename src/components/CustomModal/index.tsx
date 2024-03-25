import React from "react";
import { Divider, Modal, ModalProps } from "antd";
import classNames from "classnames";

import theme from "../theme/light-theme.css";
import styles from "./style.css";

interface CustomModalProps extends ModalProps {
    closeHandler: () => void;
    titleText?: string;
    footerButtons?: React.ReactNode;
    divider?: boolean;
}

/** Wrapper to keep styling of modals consistent:
 * class name "secondary-button" for cancel/close/ok buttons
 * class name "primary-button" for action buttons
 * provide footerButtons as single <Button> or multiple buttons wrapped in a <>
 */
const CustomModal: React.FC<CustomModalProps> = ({
    closeHandler,
    titleText,
    footerButtons,
    divider,
    ...props
}) => {
    /**
     *  custom close icon, positioned inside title: has correct icon
     *  and ensures proper placement if header height changes
     */
    const title = (
        <>
            <span>{titleText}</span>
            <span
                className={classNames("icon-moon", "anticon", "close-icon")}
                onClick={closeHandler}
            ></span>
        </>
    );

    /**
     *  spacing styles differ slightly between divider and non-divider modals
     */
    const footer = (
        <>
            {divider ? <Divider /> : null}
            <div className={classNames(styles.footerButtonContainer)}>
                {footerButtons}
            </div>
        </>
    );

    return (
        <Modal
            {...props}
            className={classNames(
                styles.modal,
                theme.lightTheme,
                divider && styles.divider,
                props.className
            )}
            onCancel={closeHandler}
            closable={false}
            title={title}
            footer={footer}
            open
            centered
        />
    );
};

export default CustomModal;
