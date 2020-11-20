import * as React from "react";

const styles = require("./style.css");

const NetworkFileFailedText: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <h3>Simulation failed to load</h3>
            <p>
                Try reloading the page. If you continue to have problems you can
                submit a bug report through{" "}
                <a href="https://github.com/allen-cell-animated/simularium-website/issues">
                    Github{" "}
                </a>
                or{" "}
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeJVBWC8SZrVaMhiI53xM41kDyknpu2hr2F5iPGevhcs-JbyA/viewform">
                    contact us.
                </a>
            </p>
        </div>
    );
};

export default NetworkFileFailedText;
