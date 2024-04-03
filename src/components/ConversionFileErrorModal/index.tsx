import { Button } from "antd";
import React from "react";
import classNames from "classnames";

import { AvailableEngines } from "../../state/trajectory/conversion-data-types";
import CustomModal from "../CustomModal";
import { Exclamation } from "../Icons";

import styles from "./style.css";

interface ConversionFileErrorModalProps {
    closeModal: () => void;
    engineType: AvailableEngines;
}

const ConversionFileErrorModal: React.FC<ConversionFileErrorModalProps> = ({
    closeModal,
    engineType,
}) => {
    const footerButton = (
        <Button className="primary-button" onClick={closeModal}>
            OK
        </Button>
    );

    return (
        <CustomModal
            className={styles.errorModal}
            titleText="File import cannot be completed"
            footerButtons={footerButton}
            closeHandler={closeModal}
        >
            {/* <> */}
            <p className={classNames(styles.warningText)}>
                {Exclamation}{" "}
                {` We're sorry, there was a problem importing your file.`}
            </p>
            <p>
                {`You may want to double check that the file you selected is a
                    valid`}{" "}
                {engineType}{" "}
                {` file and try again. For further
                    assistance, please visit `}
                <a
                    href="https://forum.allencell.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    The Allen Cell Discussion Forum.
                </a>
            </p>
            {/* </> */}
        </CustomModal>
    );
};

export default ConversionFileErrorModal;
