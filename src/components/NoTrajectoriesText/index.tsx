import * as React from "react";
import { Link } from "react-router-dom";

const NoTrajectoriesText: React.FunctionComponent<{}> = () => {
    return (
        <div>
            <h3>No trajectories loaded</h3>
            <p>
                To try out the Simularium Viewer, either download our example
                data or convert your own data, then drag and drop it onto the
                viewer.
            </p>
            <p>
                For details on how to prepare your data, visit{" "}
                <Link to="/tutorial">Getting Started</Link>.
            </p>
        </div>
    );
};

export default NoTrajectoriesText;
