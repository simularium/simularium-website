import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";
import { RoundWarning } from "../Icons";

interface ConversionServerCheckModalProps {}

const ConversionServerCheckModal: React.FC<
    ConversionServerCheckModalProps
> = ({}) => {
    const footerButtons = (
        <>
            <Button type="primary">Ok</Button>
        </>
    );

    return (
        <CustomModal
            className={styles.serverCheckModal}
            title="Cancel file import"
            open
            footer={footerButtons}
            width={425}
            centered
        >
            <div className={styles.redText}>
                {" "}
                {RoundWarning} We're sorry, the server is currently experiencing
                an issue.
            </div>
            <span>
                {" "}
                Please try again at a later time. For further assitance, please
                visit{" "}
            </span>
            <div className={styles.blueText}>
                {" "}
                The Allen Cell Discussion Forum.
            </div>
        </CustomModal>
    );
};

export default ConversionServerCheckModal;
