import * as React from "react";
import { CONTACT_FORM_URL, ISSUE_URL } from "../../constants";

const styles = require("./style.css");

const NetworkFileFailedText: React.FunctionComponent<{}> = () => {
    return (
        <div className={styles.container}>
            <h3>Simulation failed to load</h3>
            <p>
                Try reloading the page. If you continue to have problems you can
                submit a bug report through <a href={ISSUE_URL}>GitHub </a>
                or <a href={CONTACT_FORM_URL}>contact us.</a>
            </p>
        </div>
    );
};

export default NetworkFileFailedText;