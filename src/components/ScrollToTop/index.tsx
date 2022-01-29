/* 
Including this component in src/index.tsx prevents the user
from navigating to a page using a React Router Link
and finding themselves in the middle of the new page. 

Source: https://reactrouter.com/web/guides/scroll-restoration
*/

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
