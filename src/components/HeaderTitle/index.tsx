import * as React from "react";
import { useLocation } from "react-router-dom";

interface HeaderTitleProps {
    simulariumFileName: string;
}

const HeaderTitle: React.FunctionComponent<HeaderTitleProps> = (
    props: HeaderTitleProps
) => {
    const { simulariumFileName } = props;
    const location = useLocation();
    const title =
        location.pathname.startsWith("/viewer") && simulariumFileName
            ? simulariumFileName
            : "";
    return <span>{title}</span>;
};

export default HeaderTitle;
