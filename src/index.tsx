import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
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

render(
    <Provider store={createReduxStore()}>
        <Layout>
            <BrowserRouter
                basename={process.env.GH_BUILD ? "/simularium-website/" : ""}
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
                        >
                            {route.component}
                        </Route>
                    ))}
                </Switch>
            </BrowserRouter>
        </Layout>
    </Provider>,
    document.getElementById(APP_ID)
);
