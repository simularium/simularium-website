import React from "react";

import TutorialPage from "../components/TutorialPage";
import LandingPage from "../components/LandingPage";
import Simularium from "../containers/Simularium";

export default [
    {
        name: "Tutorial",
        component: <TutorialPage />,
        path: "/tutorial",
    },
    {
        name: "Landing Page",
        component: <LandingPage />,
        path: "/",
    },
    {
        name: "Viewer",
        component: <Simularium />,
        path: "/viewer",
    },
];
