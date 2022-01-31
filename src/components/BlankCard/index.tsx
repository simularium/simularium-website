import * as React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";

import { VIEWER_PATHNAME, TUTORIAL_PATHNAME } from "../../routes";
import ImportThumbnail from "../../assets/import-thumbnail.svg";

const styles = require("../ModelCard/style.css");

const BlankCard = (): JSX.Element => {
    return (
        <Card
            className={styles.card}
            cover={
                <Link to={VIEWER_PATHNAME}>
                    <img src={ImportThumbnail} />
                </Link>
            }
        >
            <div className={styles.loadYourData}>
                <p className={styles.versionAndTime}>&nbsp;</p>
                <Link to={VIEWER_PATHNAME}>
                    <p className={styles.cardTitle}>Load your data</p>
                </Link>
                <p>
                    Load your own data into the viewer. Learn how to convert
                    your data{" "}
                    <a href={`${TUTORIAL_PATHNAME}#convert-your-data`}>here</a>.
                </p>
            </div>
        </Card>
    );
};

export default BlankCard;
