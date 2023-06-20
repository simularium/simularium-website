import { Button } from "antd";
import React from "react";

import CustomModal from "../CustomModal";

import styles from "./style.css";
import { RoundWarning } from "../Icons";

interface ConversionServerCheckModalProps {}

/////PSEUDOCODE OF APPROACH/////
// call a function that sends a websocket request with server health check id
// receive message from websocket with server health check id
// 1) do this with an event listener

//when sim controller gets instatiated it will call configure network which will call create simulator connection
// i should add to create simulator connection a health check call
// simulariumController.sendServerHealthCheck()

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
