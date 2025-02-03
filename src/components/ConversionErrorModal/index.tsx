import React from "react";
import classNames from "classnames";

import { ButtonClass } from "../../constants/interfaces";
import { CustomButton } from "../CustomButton";
import CustomModal from "../CustomModal";
import { Exclamation } from "../Icons";

import styles from "./style.css";

interface ConversionErrorModalProps {
    closeModal: () => void;
    showForumMessage: boolean;
    errorMessage?: string;
}

const ConversionErrorModal: React.FC<ConversionErrorModalProps> = ({
    closeModal,
    errorMessage,
    showForumMessage = true,
}) => {
    const footerButton = (
        <CustomButton variant={ButtonClass.LightPrimary} onClick={closeModal}>
            OK
        </CustomButton>
    );

    return (
        <CustomModal
            titleText="File import cannot be completed"
            footerButtons={footerButton}
            closeHandler={closeModal}
        >
            <p className={classNames(styles.warningText)}>
                {Exclamation} We&apos;re sorry, there was a problem importing
                your file.
            </p>
            <p>
                {errorMessage}
                {showForumMessage && (
                    <>
                        <>For further assistance, please visit: </>
                        <a
                            href="https://forum.allencell.org/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            The Allen Cell Discussion Forum.
                        </a>
                    </>
                )}
            </p>
        </CustomModal>
    );
};

export default ConversionErrorModal;
