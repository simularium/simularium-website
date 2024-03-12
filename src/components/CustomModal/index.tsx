import React from "react";
import { Modal, ModalProps } from "antd";
import classNames from "classnames";

import theme from "../theme/light-theme.css";
import styles from "./style.css";

/** Tiny wrapper component to keep modal styling consistent */
const CustomModal: React.FC<ModalProps> = (props) => (
    <Modal
        {...props}
        className={classNames(theme.lightTheme, styles.modal, props.className)}
    />
);

export default CustomModal;
