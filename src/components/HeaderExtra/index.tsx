import * as React from "react";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import moment from "moment";
import { VIEWER_PATHNAME } from "../../routes";

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
        location.pathname.startsWith(VIEWER_PATHNAME) && simulariumFileName ? (
            <span>{simulariumFileName}</span>
        ) : (
            <span />
        );
    const tag =
        location.pathname.startsWith(VIEWER_PATHNAME) && lastModified ? (
            <Tag className={styles.tag}>
                modified: {moment(lastModified).format("YYYY-MM-DD, h:m A")}
            </Tag>
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
