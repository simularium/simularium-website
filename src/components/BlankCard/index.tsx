import * as React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";

import { VIEWER_PATHNAME } from "../../routes";
import ImportThumbnail from "../../assets/import-thumbnail.svg";

const styles = require("../ModelCard/style.css");

const BlankCard: React.FunctionComponent<{}> = () => {
    return (
        <Card
            className={styles.card}
            cover={
                <Link to={VIEWER_PATHNAME}>
                    <img src={ImportThumbnail} />
                </Link>
            }
        >
            <div className={styles.cardText}>
                <p className={styles.simulatedTime}>&nbsp;</p>
                <Link to={VIEWER_PATHNAME}>
                    <p className={styles.cardTitle}>LOAD YOUR DATA</p>
                </Link>
                <p>
                    Load your own data into the viewer. Learn how to convert
                    your data{" "}
                    <a href="https://simularium.allencell.org/tutorial#convert-your-data">
                        here
                    </a>
                    .
                </p>
            </div>
        </Card>
    );
};

export default BlankCard;
