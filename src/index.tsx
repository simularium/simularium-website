import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, batch } from "react-redux";
import { Layout } from "antd";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import routes, { EMBED_PATHNAME, VIEWER_PATHNAME } from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import AppHeader from "./containers/AppHeader";
import { APP_ID, URL_PARAM_KEY_FILE_NAME } from "./constants";
import TRAJECTORIES from "./constants/networked-trajectories";
import { createReduxStore } from "./state";
import { setIsPlaying } from "./state/viewer/actions";
import {
    changeToNetworkedFile,
    clearSimulariumFile,
} from "./state/trajectory/actions";
import { getUrlParamValue } from "./util/userUrlHandling";

const { Header } = Layout;

import StyleProvider from "./styles/theme/StyleProvider";
import "./style.css";

export const store = createReduxStore();
interface LocationWithState extends Location {
    state: {
        localFile?: boolean;
    };
}
function useLocationChange() {
    const location = useLocation() as LocationWithState;
    const dispatch = useDispatch();

    useEffect(() => {
        if (
            location.pathname !== VIEWER_PATHNAME &&
            location.pathname !== EMBED_PATHNAME
        ) {
            batch(() => {
                dispatch(setIsPlaying(false));
                dispatch(clearSimulariumFile({ newFile: false }));
            });
        }
    }, [location]);

    React.useEffect(() => {
        const handlePopState = () => {
            if (window.location.pathname === VIEWER_PATHNAME) {
                const trajectoryId = getUrlParamValue(
                    window.location.href,
                    URL_PARAM_KEY_FILE_NAME
                );
                if (trajectoryId) {
                    const trajectory = TRAJECTORIES.find(
                        (t) => t.id === trajectoryId
                    );
                    if (trajectory) {
                        batch(() => {
                            dispatch(setIsPlaying(false));
                            dispatch(
                                changeToNetworkedFile({
                                    name: trajectory.id,
                                    title: trajectory.title,
                                })
                            );
                        });
                    }
                } else {
                    dispatch(clearSimulariumFile({ newFile: false }));
                }
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);
}

const RouterSwitch = () => {
    useLocationChange();
    return (
        <Switch>
            {routes.map((route) => (
                <Route
                    key={route.path}
                    exact={route.path === "/"}
                    path={route.path}
                    component={route.component}
                />
            ))}
        </Switch>
    );
};

const App = () => {
    /**
     * Note for implementing redirect rules for SPA routing on AWS.
     * Currently we are just serving index.html as our 400 response. If we want to have an 404.html
     * page we can go back to this implementation: but we can't use query params
     * https://via.studio/journal/hosting-a-reactjs-app-with-routing-on-aws-s3
     *
     */

    return (
        <Provider store={store}>
            <StyleProvider>
                <Layout>
                    <BrowserRouter
                        basename={
                            process.env.GH_BUILD ? "/simularium-website/" : ""
                        }
                    >
                        <ScrollToTop />
                        {location.pathname !== EMBED_PATHNAME && (
                            <Header>
                                <AppHeader />
                            </Header>
                        )}
                        <RouterSwitch />
                    </BrowserRouter>
                </Layout>
            </StyleProvider>
        </Provider>
    );
};

// vars filled at build time using webpack DefinePlugin
console.log("Welcome to Simularium " + SIMULARIUM_BUILD_ENVIRONMENT + " build");
console.log("Simularium Website Version " + SIMULARIUM_WEBSITE_VERSION);
console.log("Simularium Viewer Version " + SIMULARIUM_VIEWER_VERSION);

const container: HTMLElement | null = document.getElementById(APP_ID);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<App />);
