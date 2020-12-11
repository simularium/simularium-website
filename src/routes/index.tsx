import React from "react";

import TutorialPage from "../components/TutorialPage";
import LandingPage from "../components/LandingPage";
import Simularium from "../containers/Simularium";
import { useLocation } from "react-router-dom";
import { store } from "..";
import { clearSimulariumFile } from "../state/metadata/actions";
import {
    getSimulariumController,
    getSimulariumFile,
} from "../state/metadata/selectors";

export const VIEWER_PATHNAME = "/viewer";
export const TUTORIAL_PATHNAME = "/tutorial";

interface LocationWithState extends Location {
    state: {
        localFile?: boolean;
    };
}
function RenderSimularium() {
    const location = useLocation() as LocationWithState;
    React.useEffect(() => {
        const state = store.getState();
        const controller = getSimulariumController(state);
        const simFile = getSimulariumFile(state);
        if (location.state && location.state.localFile) {
            return;
        }
        if (!location.search && controller && simFile.name) {
            // going to /viewer, clear out any existing files
            store.dispatch(clearSimulariumFile(false));
        }
    }, [location]);

    return <Simularium />;
}

export default [
    {
        name: "Home",
        component: LandingPage,
        path: "/",
    },
    {
        name: "Getting Started",
        component: TutorialPage,
        path: TUTORIAL_PATHNAME,
    },
    {
        name: "Run Simulations",
        component: RenderSimularium,
        path: VIEWER_PATHNAME,
    },
];
