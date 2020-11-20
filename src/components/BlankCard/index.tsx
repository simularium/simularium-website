import * as React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";

import { VIEWER_PATHNAME } from "../../routes";
// TODO: swap this image out
import listeriaNormalImage from "../../assets/listeria-normal.png";

const styles = require("../ModelCard/style.css");

const BlankCard: React.FunctionComponent<{}> = () => {
    return (
        <Card
            className={styles.card}
            cover={
                <Link to={VIEWER_PATHNAME}>
                    <img src={listeriaNormalImage} />
                </Link>
            }
        >
            <div className={styles.cardText}>
                <p className={styles.simulatedTime}>&nbsp;</p>
                <Link to={VIEWER_PATHNAME}>
                    <p className={styles.cardTitle}>LOAD YOUR DATA</p>
                </Link>
                <p>testing</p>
            </div>
        </Card>
    );
};

export default BlankCard;
