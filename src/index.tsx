import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, batch } from "react-redux";
import { Layout } from "antd";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";

import { APP_ID } from "./constants";

import { createReduxStore } from "./state";
import routes, { EMBED_PATHNAME, VIEWER_PATHNAME } from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import AppHeader from "./containers/AppHeader";

const { Header } = Layout;

import "./style.css";
import { setIsPlaying } from "./state/viewer/actions";
import { clearSimulariumFile } from "./state/trajectory/actions";

export const store = createReduxStore();
interface LocationWithState extends Location {
    state: {
        localFile?: boolean;
    };
}
function useLocationChange() {
    const location = useLocation() as LocationWithState;
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (
            location.pathname !== VIEWER_PATHNAME &&
            location.pathname !== EMBED_PATHNAME
        ) {
            batch(() => {
                // if we're navigating away from the viewer, stop playing and reset state
                dispatch(setIsPlaying(false));
                dispatch(clearSimulariumFile({ newFile: false }));
            });
        }
    }, [location]);
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
