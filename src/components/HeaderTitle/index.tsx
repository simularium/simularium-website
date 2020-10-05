import * as React from "react";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import moment from "moment";

const styles = require("./style.css");

interface HeaderTitleProps {
    simulariumFileName: string;
    lastModified?: number;
}

const HeaderTitle: React.FunctionComponent<HeaderTitleProps> = (
    props: HeaderTitleProps
) => {
    const { simulariumFileName, lastModified } = props;
    const location = useLocation();
    const title =
        location.pathname.startsWith("/viewer") && simulariumFileName
            ? simulariumFileName
            : "";
    const tag =
        location.pathname.startsWith("/viewer") && lastModified ? (
            <Tag className={styles.tag}>{moment(lastModified).format()}</Tag>
        ) : (
            <span />
        );

    return (
        <span>
            {title}
            {tag}
        </span>
    );
};

export default HeaderTitle;
