import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { APP_ID } from "./constants";
import App from "./containers/App";
import { createReduxStore } from "./state";

render(
    <Provider store={createReduxStore()}>
        <App />
    </Provider>,
    document.getElementById(APP_ID)
);
