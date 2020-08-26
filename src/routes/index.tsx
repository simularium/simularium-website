import React from "react";

import TutorialPage from "../components/TutorialPage";
import LandingPage from "../components/LandingPage";
import Simularium from "../containers/Simularium";

export default [
    {
        name: "Home",
        component: <LandingPage />,
        path: "/",
    },
    {
        name: "Getting Started",
        component: <TutorialPage />,
        path: "/tutorial",
    },
    {
        name: "Run Simulations",
        component: <Simularium />,
        path: "/viewer",
    },
];
