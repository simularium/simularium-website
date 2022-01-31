import * as React from "react";
import { FORUM_BUG_REPORT_URL, ISSUE_URL } from "../../constants";

const styles = require("./style.css");

const NetworkFileFailedText = (): JSX.Element => {
    return (
        <div className={styles.container}>
            <h3>Simulation failed to load</h3>
            <p>
                Try reloading the page. If you continue to have problems you can
                submit a bug report through <a href={ISSUE_URL}>GitHub </a>
                or the <a href={FORUM_BUG_REPORT_URL}>Simularium forum.</a>
            </p>
        </div>
    );
};

export default NetworkFileFailedText;
