import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import React from "react";
import { render } from "react-dom";
import { Provider, useDispatch } from "react-redux";
import { Layout } from "antd";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";

import { APP_ID } from "./constants";

import { createReduxStore } from "./state";
import routes, { VIEWER_PATHNAME } from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import AppHeader from "./containers/AppHeader";

const { Header } = Layout;

import "./style.css";
import { setIsPlaying } from "./state/viewer/actions";
import { clearSimulariumFile } from "./state/trajectory/actions";
import { getSimulariumFile } from "./state/trajectory/selectors";
import { getSimulariumController } from "./state/simularium/selectors";

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
        if (location.pathname === VIEWER_PATHNAME) {
            /**
             * Gets called every time the app navigates to the Simularium page.
             * There are 2 possible url types and 3 different states the viewer should be in
             * when we get there:
             * 1. Empty viewer, by clicking "launch viewer" or "load your own data" card; url: '/viewer'
             * 2. Loading network file; url: '/viewer?trajFileName=FILE_NAME'
             * 3. Loading a local file through the dropdown, will be reflected in the location state; url: '/viewer'
             */
            const state = store.getState();
            const controller = getSimulariumController(state);
            const simFile = getSimulariumFile(state);
            // got here from the "load local file button" so the app is going to
            // `/viewer`, but the loadFile action will take care of resetting state
            // if the user clicks "Open"
            if (location.state && location.state.localFile) {
                return;
            }
            if (!location.search && controller && simFile.name) {
                // going to /viewer, clear out any existing files
                dispatch(clearSimulariumFile({ newFile: false }));
            }
        } else {
            // if we're navigating away from the viewer, stop playing
            dispatch(setIsPlaying(false));
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

const App: React.FunctionComponent<{}> = () => {
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
                    <Header>
                        <AppHeader />
                    </Header>
                    <RouterSwitch />
                </BrowserRouter>
            </Layout>
        </Provider>
    );
};

const renderApp = () => render(<App />, document.getElementById(APP_ID));

renderApp();
