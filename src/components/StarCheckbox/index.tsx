import * as React from "react";
import classNames from "classnames";

const styles = require("./style.css");

const StarCheckbox: React.FunctionComponent = ({
    checked,
    indeterminate,
    onChange,
}) => {
    const checkboxClassNames = classNames(["icon-moon", styles.checkbox], {
        [styles.checked]: checked,
        [styles.indeterminate]: indeterminate,
    });
    const handleChange = (event) => {
        console.log("changed", event.target);
    };

    const onClick = (event) => {
        console.log("click", event.target);
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <input
                    checked={checked}
                    type="checkbox"
                    onChange={onChange}
                    onClick={onClick}
                />
                <span className={checkboxClassNames} />
            </div>
        </div>
    );
};

export default StarCheckbox;
