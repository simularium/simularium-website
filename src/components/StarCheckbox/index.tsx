import React from "react";
import classNames from "classnames";
import { CheckboxChangeEvent, CheckboxProps } from "antd/lib/checkbox";

const styles = require("./style.css");

const StarCheckbox: React.FunctionComponent<CheckboxProps> = ({
    checked,
    indeterminate,
    onChange,
    value,
    className,
}: CheckboxProps) => {
    const parentClassnames = className ? className.split(" ") : [];
    const wrapperClassnames = classNames([...parentClassnames, styles.wrapper]);
    const checkboxClassNames = classNames(["icon-moon", styles.checkbox], {
        [styles.checked]: checked,
        [styles.indeterminate]: indeterminate,
    });
    const handleCheckboxChange = (event: any) => {
        /* typescript compatibility issue between ChangeEvent<HTMLInput>
         * and CheckboxChangeEvent.
         * This solves the issue, but there is probably a better way
         */
        if (onChange) {
            onChange(event as CheckboxChangeEvent);
        }
    };
    return (
        <label className={wrapperClassnames}>
            <span className={styles.container}>
                <input
                    checked={checked}
                    type="checkbox"
                    onChange={handleCheckboxChange}
                    value={value}
                />
                <span className={checkboxClassNames} />
            </span>
        </label>
    );
};

export default StarCheckbox;
