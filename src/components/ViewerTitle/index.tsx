import * as React from "react";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import moment from "moment";
import { VIEWER_PATHNAME } from "../../routes";

const styles = require("./style.css");

interface ViewerTitleProps {
    simulariumFileName: string;
    lastModified?: number;
}

const ViewerTitle: React.FunctionComponent<ViewerTitleProps> = (
    props: ViewerTitleProps
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
        <span className={styles.container}>
            {title} {tag}
        </span>
    );
};

export default ViewerTitle;
