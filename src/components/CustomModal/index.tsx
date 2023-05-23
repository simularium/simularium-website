import React from "react";
import { Modal, ModalProps } from "antd";
import classNames from "classnames";

import styles from "./style.css";
import theme from "../theme/light-theme.css";

/** Tiny wrapper component to keep modal styling consistent */
const CustomModal: React.FC<ModalProps> = (props) => (
    <Modal
        {...props}
        className={classNames(styles.modal, theme.lightTheme, props.className)}
    />
);

export default CustomModal;
