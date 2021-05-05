import * as React from "react";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import moment from "moment";

import { VIEWER_PATHNAME } from "../../routes";
import TRAJECTORIES from "../../constants/networked-trajectories";

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

    const trajectoryId = location.search.replace("?trajFileName=", "");
    const currentTrajectory = TRAJECTORIES.find(
        (trajectory) => trajectory.id === trajectoryId
    );
    const version = currentTrajectory ? currentTrajectory.version : "";

    let tagText = "";
    if (lastModified) {
        tagText = `modified: ${moment(lastModified).format(
            "YYYY-MM-DD, h:m A"
        )}`;
    } else if (version) {
        tagText = `v${version}`;
    }

    const tag =
        location.pathname.startsWith(VIEWER_PATHNAME) && tagText ? (
            <Tag className={styles.tag}>{tagText}</Tag>
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
