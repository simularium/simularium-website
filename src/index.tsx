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
