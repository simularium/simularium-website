import { Button } from "antd";
import React from "react";
import classNames from "classnames";

import { AvailableEngines } from "../../state/trajectory/conversion-data-types";
import CustomModal from "../CustomModal";
import { Exclamation } from "../Icons";

import styles from "./style.css";
import { ConversionError } from "../../constants/interfaces";

interface ConversionErrorModalProps {
    closeModal: () => void;
    conversionError: ConversionError;
    engineType: AvailableEngines;
}

const ConversionErrorModal: React.FC<ConversionErrorModalProps> = ({
    closeModal,
    conversionError,
    engineType,
}) => {
    const footerButton = (
        <Button className="primary-button" onClick={closeModal}>
            OK
        </Button>
    );

    const getErrorMessage = () => {
        switch (conversionError) {
            case ConversionError.SERVER_ERROR:
                return (
                    <p>
                        {`Please try again at a later time. For further assistance, please
                visit `}
                        <a
                            href="https://forum.allencell.org/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            The Allen Cell Discussion Forum.
                        </a>
                    </p>
                );
            case ConversionError.FILE_TYPE_ERROR:
                return (
                    <p>
                        {`You may want to double check that the file you selected is a
                    valid `}
                        {engineType}
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
                );
            case ConversionError.FILE_SIZE_ERROR:
                return (
                    <p>
                        {`Your file exceeds the maximum allowed size of 200 MB, please try uploading a smaller file.`}
                    </p>
                );
            default:
                return null;
        }
    };

    return (
        <CustomModal
            titleText="File import cannot be completed"
            footerButtons={footerButton}
            closeHandler={closeModal}
        >
            <p className={classNames(styles.warningText)}>
                {Exclamation}
                {` We're sorry, there was a problem importing your file.`}
            </p>
            {getErrorMessage()}
        </CustomModal>
    );
};

export default ConversionErrorModal;
