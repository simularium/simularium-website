import React from "react";
import { Modal, ModalProps } from "antd";
import classNames from "classnames";

import styles from "./style.css";

/** Tiny wrapper component to keep modal styling consistent */
const CustomModal: React.FC<ModalProps> = (props) => (
    <Modal {...props} className={classNames(styles.modal, props.className)} />
);

export default CustomModal;
