import React from "react";
import { useDispatch } from "react-redux";
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
    /**
     * Gets called every time the app navigates to the Simularium page.
     * There are 3 different states the viewer should be in
     * when we get there:
     * 1. Empty viewer, by clicking "launch viewer" or "load your own data" card
     * 2. Loading network file, the url will have a search param with the file name
     * 3. Loading a local file through the dropdown, will be reflexed in the location state
     */
    const location = useLocation() as LocationWithState;
    const dispatch = useDispatch();
    React.useEffect(() => {
        const state = store.getState();
        const controller = getSimulariumController(state);
        const simFile = getSimulariumFile(state);
        // got here from the "load local file button" so the app is going to
        // `/viewer` but don't want to clear out the viewer
        if (location.state && location.state.localFile) {
            return;
        }
        if (!location.search && controller && simFile.name) {
            // going to /viewer, clear out any existing files
            dispatch(clearSimulariumFile(false));
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
