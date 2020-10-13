import React from "react";

import TutorialPage from "../components/TutorialPage";
import LandingPage from "../components/LandingPage";
import Simularium from "../containers/Simularium";

export const VIEWER_PATHNAME = "/viewer";
export const TUTORIAL_PATHNAME = "/tutorial";

export default [
    {
        name: "Home",
        component: <LandingPage />,
        path: "/",
    },
    {
        name: "Getting Started",
        component: <TutorialPage />,
        path: TUTORIAL_PATHNAME,
    },
    {
        name: "Run Simulations",
        component: <Simularium />,
        path: VIEWER_PATHNAME,
    },
];
