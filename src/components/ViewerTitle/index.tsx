import * as React from "react";
import { useLocation } from "react-router-dom";
import { Tag, Popover } from "antd";
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
        location.pathname.startsWith(VIEWER_PATHNAME) && simulariumFileName
            ? simulariumFileName
            : "";

    // Grab the trajectory ID from the URL and find the corresponding trajectory object in
    // networked-trajectories.ts to get its version info
    // TODO: Eventually we should put all the contents of networked-trajectories.ts in the
    // Simularium files themselves
    const trajectoryId = location.search.replace("?trajFileName=", "");
    const currentTrajectory = TRAJECTORIES.find(
        (trajectory) => trajectory.id === trajectoryId
    );
    const version = currentTrajectory ? currentTrajectory.version : "";

    let tagText = "";

    // If the trajectory file was loaded from an external link (trajUrl param), we set
    // lastModified to a date in the future when we received it (in loadFileViaUrl logic)
    // to indicate that it's not a real "last modified" date and that it shouldn't be displayed as such
    const shouldShowModifiedDate =
        lastModified && lastModified - Date.now() < 0;
    if (shouldShowModifiedDate) {
        tagText = `modified: ${moment(lastModified).format(
            "YYYY-MM-DD, h:mm A"
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
        <div className={styles.container}>
            <Popover content={title} mouseEnterDelay={1} mouseLeaveDelay={0}>
                <div className={styles.title}>{title}</div>
            </Popover>
            <div>{tag}</div>
        </div>
    );
};

export default ViewerTitle;
