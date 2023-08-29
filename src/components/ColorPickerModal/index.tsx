import React, { useState } from "react";
import { Modal } from "antd";
import ColorPicker from "../ColorPicker";

import styles from "./style.css";

const OurColorPicker = () => {
    const [color, setColor] = useState({ h: 250, s: 0.5, l: 0.5, a: 1 });

    return (
        <Modal
            className={styles.modalStyle}
            open={true}
            title=""
            footer={null}
            closeIcon={false}
            closable={false}
            width={225}
        >
            <ColorPicker />
        </Modal>
        //  </div>
    );
};
export default OurColorPicker;
