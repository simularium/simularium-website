import * as React from "react";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import moment from "moment";

const styles = require("./style.css");

interface HeaderExtraProps {
    simulariumFileName: string;
    lastModified?: number;
}

const HeaderExtra: React.FunctionComponent<HeaderExtraProps> = (
    props: HeaderExtraProps
) => {
    const { simulariumFileName, lastModified } = props;
    const location = useLocation();
    const title =
        location.pathname.startsWith("/viewer") && simulariumFileName ? (
            <span>{simulariumFileName}</span>
        ) : (
            <span />
        );
    const tag =
        location.pathname.startsWith("/viewer") && lastModified ? (
            <Tag className={styles.tag}>{moment(lastModified).format()}</Tag>
        ) : (
            <span />
        );

    return (
        <div className={styles.container}>
            {title} {tag}
        </div>
    );
};

export default HeaderExtra;
