import React from "react";
import { Divider, Modal, ModalProps } from "antd";
import classNames from "classnames";

import { IconGlyphs } from "../../constants/interfaces";
import { getIconGlyphClasses } from "../../util";

import styles from "./style.css";

type OmittedProps =
    | "onCancel"
    | "closable"
    | "title"
    | "footer"
    | "open"
    | "centered";
interface CustomModalProps extends Omit<ModalProps, OmittedProps> {
    closeHandler: () => void;
    titleText?: string;
    footerButtons?: React.ReactNode;
    divider?: boolean;
    wrapProps?: { onDragOver: (e: DragEvent) => void };
    wrapClassName?: string;
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
    wrapProps,
    wrapClassName,
    ...props
}) => {
    const title = (
        <>
            <span>{titleText}</span>
            <span
                className={getIconGlyphClasses(IconGlyphs.Close)}
                onClick={closeHandler}
            ></span>
        </>
    );

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
                divider && styles.divider,
                props.className
            )}
            onCancel={closeHandler}
            closable={false}
            title={title}
            footer={footer}
            open
            centered
            wrapClassName={wrapClassName}
            wrapProps={wrapProps}
        />
    );
};

export default CustomModal;
