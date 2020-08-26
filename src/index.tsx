import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { APP_ID } from "./constants";

import { createReduxStore } from "./state";
import routes from "./routes";

render(
    <Provider store={createReduxStore()}>
        <BrowserRouter>
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
    </Provider>,
    document.getElementById(APP_ID)
);
