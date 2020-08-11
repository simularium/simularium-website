import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { APP_ID } from "./constants";
import Simularium from "./containers/Simularium";
import LandingPage from "./containers/LandingPage";
import { createReduxStore } from "./state";

render(
    <Provider store={createReduxStore()}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <LandingPage />
                </Route>
                <Route path="/viewer">
                    <Simularium />
                </Route>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById(APP_ID)
);
