import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Layout } from "antd";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { APP_ID } from "./constants";

import { createReduxStore } from "./state";
import routes from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import AppHeader from "./containers/AppHeader";

const { Header } = Layout;

import "./style.css";

export const store = createReduxStore();

const App = () => {
    /**
     * For SPA routing on AWS:
     * https://via.studio/journal/hosting-a-reactjs-app-with-routing-on-aws-s3
     * using /#! to avoid 404 on AWS, and then setting the browser history with the updated location
     * without the /#!
     */
    // const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
    // if (path) {
    //     history.replaceState(null, "", path);
    // }

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
                </BrowserRouter>
            </Layout>
        </Provider>
    );
};

const renderApp = () => render(App(), document.getElementById(APP_ID));

renderApp();
