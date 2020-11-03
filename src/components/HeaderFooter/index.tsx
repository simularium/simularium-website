import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { TUTORIAL_PATHNAME } from "../../routes";

const HeaderFooter: React.FunctionComponent<{}> = () => {
    const location = useLocation();
    const link =
        location.pathname === "/viewer" ? (
            <NavLink
                to={TUTORIAL_PATHNAME}
                target="_blank"
                rel="noopener noreferrer"
            >
                GETTING STARTED
            </NavLink>
        ) : (
            <NavLink to={TUTORIAL_PATHNAME}>GETTING STARTED</NavLink>
        );

    return link;
};

export default HeaderFooter;
